from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.cat import CatIn, CatOut, CatPatch
from app.dependencies import require_admin
import asyncpg

router = APIRouter()


@router.get("/", response_model=list[CatOut])
async def list_cats(pool: asyncpg.Pool = Depends(get_pool)):
    rows = await fetch_all(
        pool,
        "SELECT id, name, age_years, breed, description, photo_url, is_adopted, tags, created_at "
        "FROM cats WHERE is_adopted = false ORDER BY created_at DESC",
    )
    return [dict(r) for r in rows]


@router.get("/{cat_id}", response_model=CatOut)
async def get_cat(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "SELECT id, name, age_years, breed, description, photo_url, is_adopted, tags, created_at "
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
        "INSERT INTO cats (name, age_years, breed, description, photo_url, tags) "
        "VALUES ($1, $2, $3, $4, $5, $6) "
        "RETURNING id, name, age_years, breed, description, photo_url, is_adopted, tags, created_at",
        payload.name, payload.age_years, payload.breed,
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
        "RETURNING id, name, age_years, breed, description, photo_url, is_adopted, tags, created_at",
        cat_id, *values,
    )
    return dict(row)


@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_cat(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(pool, "DELETE FROM cats WHERE id = $1", cat_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")
