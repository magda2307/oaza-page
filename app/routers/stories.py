from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.story import StoryIn, StoryOut, StoryPatch
from app.dependencies import require_admin
import asyncpg

router = APIRouter()

_SELECT = (
    "SELECT id, cat_name, adopter_name, title, story, photo_url, "
    "is_published, published_at, created_at FROM success_stories"
)


@router.get("/", response_model=list[StoryOut])
async def list_stories(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
):
    offset = (page - 1) * limit
    rows = await fetch_all(
        pool,
        f"{_SELECT} WHERE is_published = true "
        "ORDER BY published_at DESC NULLS LAST, created_at DESC "
        "LIMIT $1 OFFSET $2",
        limit, offset,
    )
    return [dict(r) for r in rows]


@router.get("/{story_id}", response_model=StoryOut)
async def get_story(story_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(pool, f"{_SELECT} WHERE id = $1 AND is_published = true", story_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    return dict(row)


@router.post("/", response_model=StoryOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def create_story(payload: StoryIn, pool: asyncpg.Pool = Depends(get_pool)):
    published_at = "now()" if payload.is_published else "NULL"
    row = await fetch_one(
        pool,
        "INSERT INTO success_stories (cat_name, adopter_name, title, story, photo_url, is_published, published_at) "
        f"VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $6 THEN now() ELSE NULL END) "
        "RETURNING id, cat_name, adopter_name, title, story, photo_url, is_published, published_at, created_at",
        payload.cat_name, payload.adopter_name, payload.title,
        payload.story, payload.photo_url, payload.is_published,
    )
    return dict(row)


@router.patch("/{story_id}", response_model=StoryOut,
              dependencies=[Depends(require_admin)])
async def patch_story(
    story_id: int, payload: StoryPatch, pool: asyncpg.Pool = Depends(get_pool)
):
    existing = await fetch_one(
        pool,
        "SELECT id, is_published FROM success_stories WHERE id = $1", story_id
    )
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")

    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    # Auto-set published_at when is_published flips to true
    if updates.get("is_published") is True and not existing["is_published"]:
        updates["published_at"] = "__now__"
    elif updates.get("is_published") is False:
        updates["published_at"] = None

    # Build SET clause — handle the __now__ sentinel
    parts = []
    values = [story_id]
    i = 2
    for k, v in updates.items():
        if v == "__now__":
            parts.append(f"{k} = now()")
        else:
            parts.append(f"{k} = ${i}")
            values.append(v)
            i += 1
    set_clause = ", ".join(parts)

    row = await fetch_one(
        pool,
        f"UPDATE success_stories SET {set_clause} WHERE id = $1 "
        "RETURNING id, cat_name, adopter_name, title, story, photo_url, is_published, published_at, created_at",
        *values,
    )
    return dict(row)


@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_story(story_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(pool, "DELETE FROM success_stories WHERE id = $1", story_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
