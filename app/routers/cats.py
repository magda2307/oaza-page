import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.cat import CatIn, CatOut, CatPatch, CatDetailOut
from app.models.pagination import Page
from app.models.tags import TAG_VOCABULARY
from app.dependencies import require_admin
import asyncpg

router = APIRouter()

_TAG_TO_CATEGORY: dict[str, str] = {
    tag: key
    for key, cat in TAG_VOCABULARY.items()
    for tag in cat["tags"]
}


@router.get("/tag-categories")
async def list_tag_categories():
    return [
        {"key": key, "label": cat["label"], "tags": cat["tags"]}
        for key, cat in TAG_VOCABULARY.items()
    ]


@router.get("/tags")
async def list_tags(pool: asyncpg.Pool = Depends(get_pool)):
    rows = await fetch_all(
        pool,
        "SELECT unnest(tags) as tag, count(*) as cnt FROM cats WHERE NOT is_adopted GROUP BY 1 ORDER BY 2 DESC",
    )
    return [
        {"tag": r["tag"], "count": r["cnt"], "category": _TAG_TO_CATEGORY.get(r["tag"])}
        for r in rows
    ]


@router.get("/stats")
async def stats(pool: asyncpg.Pool = Depends(get_pool)):
    cats_row, stories_row = await asyncio.gather(
        fetch_one(
            pool,
            "SELECT COUNT(*) FILTER (WHERE NOT is_adopted) as cats_available, "
            "COUNT(*) FILTER (WHERE is_adopted) as cats_adopted FROM cats",
        ),
        fetch_one(
            pool,
            "SELECT COUNT(*) as success_stories FROM success_stories WHERE is_published = true",
        ),
    )
    return {
        "cats_available": cats_row["cats_available"],
        "cats_adopted": cats_row["cats_adopted"],
        "success_stories": stories_row["success_stories"],
    }


@router.get("/", response_model=Page[CatOut])
async def list_cats(
    pool: asyncpg.Pool = Depends(get_pool),
    tags: list[str] = Query(default=[]),
    sex: str | None = None,
    age_min: float | None = None,
    age_max: float | None = None,
    q: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    conditions = ["is_adopted = false"]
    params: list = []
    param_idx = 1

    for tag in tags:
        conditions.append(f"${param_idx} = ANY(tags)")
        params.append(tag)
        param_idx += 1

    if sex is not None:
        conditions.append(f"sex = ${param_idx}")
        params.append(sex)
        param_idx += 1

    if age_min is not None:
        conditions.append(f"age_years >= ${param_idx}")
        params.append(age_min)
        param_idx += 1

    if age_max is not None:
        conditions.append(f"age_years <= ${param_idx}")
        params.append(age_max)
        param_idx += 1

    if q is not None:
        conditions.append(
            f"(name ILIKE ${param_idx} OR breed ILIKE ${param_idx} OR description ILIKE ${param_idx})"
        )
        params.append(f"%{q}%")
        param_idx += 1

    where = " AND ".join(conditions)
    filter_params = list(params)
    params.append(limit)
    params.append(offset)
    query = (
        f"SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
        f"FROM cats WHERE {where} ORDER BY created_at DESC LIMIT ${param_idx} OFFSET ${param_idx + 1}"
    )
    count_query = f"SELECT COUNT(*) as total FROM cats WHERE {where}"

    rows, count_row = await asyncio.gather(
        fetch_all(pool, query, *params),
        fetch_one(pool, count_query, *filter_params),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.get("/{cat_id}", response_model=CatDetailOut)
async def get_cat(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
        "FROM cats WHERE id = $1",
        cat_id,
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")

    photos_rows, fundraiser_row = await asyncio.gather(
        fetch_all(
            pool,
            "SELECT id, cat_id, url, r2_key, display_order, is_primary, created_at "
            "FROM cat_photos WHERE cat_id = $1 ORDER BY is_primary DESC, display_order ASC",
            cat_id,
        ),
        fetch_one(
            pool,
            "SELECT f.id, f.cat_id, f.title, f.description, f.goal_amount, f.raised_amount, "
            "f.is_active, f.created_at, f.closed_at, c.name as cat_name "
            "FROM fundraisers f LEFT JOIN cats c ON c.id = f.cat_id "
            "WHERE f.cat_id = $1 AND f.is_active = true ORDER BY f.created_at DESC LIMIT 1",
            cat_id,
        ),
    )

    result = dict(row)
    result["photos"] = [dict(p) for p in photos_rows]
    result["fundraiser"] = dict(fundraiser_row) if fundraiser_row else None
    return result


@router.get("/{cat_id}/related", response_model=list[CatOut])
async def related_cats(
    cat_id: int,
    pool: asyncpg.Pool = Depends(get_pool),
    limit: int = Query(default=4, ge=1, le=12),
):
    cat = await fetch_one(pool, "SELECT tags FROM cats WHERE id = $1", cat_id)
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")

    tags = cat["tags"]
    if not tags:
        rows = await fetch_all(
            pool,
            "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
            "FROM cats WHERE is_adopted = false AND id != $1 ORDER BY created_at DESC LIMIT $2",
            cat_id, limit,
        )
        return [dict(r) for r in rows]

    rows = await fetch_all(
        pool,
        "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at, "
        "  (SELECT COUNT(*) FROM unnest(tags) t WHERE t = ANY($2::text[])) AS shared "
        "FROM cats "
        "WHERE is_adopted = false AND id != $1 "
        "ORDER BY shared DESC, created_at DESC "
        "LIMIT $3",
        cat_id, tags, limit,
    )
    return [dict(r) for r in rows]


@router.post("/", response_model=CatOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def create_cat(payload: CatIn, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "INSERT INTO cats (name, age_years, sex, breed, description, photo_url, tags) "
        "VALUES ($1, $2, $3, $4, $5, $6, $7) "
        "RETURNING id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at",
        payload.name, payload.age_years, payload.sex, payload.breed,
        payload.description, payload.photo_url, payload.tags,
    )
    return dict(row)


@router.patch("/{cat_id}", response_model=CatOut, dependencies=[Depends(require_admin)])
async def patch_cat(
    cat_id: int, payload: CatPatch, pool: asyncpg.Pool = Depends(get_pool)
):
    existing = await fetch_one(pool, "SELECT id FROM cats WHERE id = $1", cat_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")

    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    set_clause = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(updates))
    values = list(updates.values())
    row = await fetch_one(
        pool,
        f"UPDATE cats SET {set_clause} WHERE id = $1 "
        "RETURNING id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at",
        cat_id, *values,
    )
    return dict(row)


@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_cat(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(pool, "DELETE FROM cats WHERE id = $1", cat_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")
