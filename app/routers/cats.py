from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.cat import CatIn, CatOut, CatPatch
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
    row = await fetch_one(
        pool,
        "SELECT COUNT(*) FILTER (WHERE NOT is_adopted) as cats_available, "
        "COUNT(*) FILTER (WHERE is_adopted) as cats_adopted FROM cats",
    )
    return {"cats_available": row["cats_available"], "cats_adopted": row["cats_adopted"]}


@router.get("/", response_model=list[CatOut])
async def list_cats(
    pool: asyncpg.Pool = Depends(get_pool),
    tags: list[str] = Query(default=[]),
    sex: str | None = None,
    age_min: float | None = None,
    age_max: float | None = None,
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

    where = " AND ".join(conditions)
    params.append(limit)
    params.append(offset)
    query = (
        f"SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
        f"FROM cats WHERE {where} ORDER BY created_at DESC LIMIT ${param_idx} OFFSET ${param_idx + 1}"
    )
    rows = await fetch_all(pool, query, *params)
    return [dict(r) for r in rows]


@router.get("/{cat_id}", response_model=CatOut)
async def get_cat(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
        "FROM cats WHERE id = $1",
        cat_id,
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")
    return dict(row)


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
