import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.dependencies import require_admin
from app.services.storage import upload_file, delete_file
from app.config import settings
from pydantic import BaseModel
from app.models.cat_photo import CatPhotoOut
import asyncpg

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024

_SELECT = "SELECT id, cat_id, url, r2_key, display_order, is_primary, created_at FROM cat_photos"


@router.get("/", response_model=list[CatPhotoOut])
async def list_cat_photos(cat_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    rows = await fetch_all(
        pool,
        f"{_SELECT} WHERE cat_id = $1 ORDER BY is_primary DESC, display_order ASC",
        cat_id,
    )
    return [dict(r) for r in rows]


@router.post("/upload", response_model=CatPhotoOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def upload_cat_photo(
    cat_id: int,
    file: UploadFile = File(...),
    pool: asyncpg.Pool = Depends(get_pool),
):
    cat = await fetch_one(pool, "SELECT id FROM cats WHERE id = $1", cat_id)
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                            detail=f"Unsupported file type: {file.content_type}")
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="File exceeds 10 MB limit")
    if not settings.r2_account_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Storage is not configured")

    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "jpg"
    r2_key = f"cats/{cat_id}/{uuid.uuid4()}.{ext}"
    url = upload_file(contents, r2_key, file.content_type)

    # Check if this is the first photo — make it primary and update cats.photo_url
    existing_count = await fetch_one(
        pool, "SELECT COUNT(*) as cnt FROM cat_photos WHERE cat_id = $1", cat_id
    )
    is_primary = existing_count["cnt"] == 0

    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                "INSERT INTO cat_photos (cat_id, url, r2_key, display_order, is_primary) "
                "VALUES ($1, $2, $3, $4, $5) "
                "RETURNING id, cat_id, url, r2_key, display_order, is_primary, created_at",
                cat_id, url, r2_key, existing_count["cnt"], is_primary,
            )
            if is_primary:
                await conn.execute(
                    "UPDATE cats SET photo_url = $1 WHERE id = $2", url, cat_id
                )
    return dict(row)


@router.patch("/{photo_id}/primary", response_model=CatPhotoOut,
              dependencies=[Depends(require_admin)])
async def set_primary_photo(
    cat_id: int, photo_id: int, pool: asyncpg.Pool = Depends(get_pool)
):
    photo = await fetch_one(
        pool, f"{_SELECT} WHERE id = $1 AND cat_id = $2", photo_id, cat_id
    )
    if not photo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")

    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                "UPDATE cat_photos SET is_primary = false WHERE cat_id = $1", cat_id
            )
            row = await conn.fetchrow(
                "UPDATE cat_photos SET is_primary = true WHERE id = $1 "
                "RETURNING id, cat_id, url, r2_key, display_order, is_primary, created_at",
                photo_id,
            )
            await conn.execute(
                "UPDATE cats SET photo_url = $1 WHERE id = $2", row["url"], cat_id
            )
    return dict(row)


class ReorderIn(BaseModel):
    photo_ids: list[int]  # ordered list — index = new display_order


@router.patch("/reorder", status_code=status.HTTP_204_NO_CONTENT,
              dependencies=[Depends(require_admin)])
async def reorder_cat_photos(
    cat_id: int, payload: ReorderIn, pool: asyncpg.Pool = Depends(get_pool)
):
    async with pool.acquire() as conn:
        async with conn.transaction():
            for order, photo_id in enumerate(payload.photo_ids):
                await conn.execute(
                    "UPDATE cat_photos SET display_order = $1 WHERE id = $2 AND cat_id = $3",
                    order, photo_id, cat_id,
                )


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_cat_photo(
    cat_id: int, photo_id: int, pool: asyncpg.Pool = Depends(get_pool)
):
    photo = await fetch_one(
        pool, f"{_SELECT} WHERE id = $1 AND cat_id = $2", photo_id, cat_id
    )
    if not photo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")

    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute("DELETE FROM cat_photos WHERE id = $1", photo_id)
            if photo["is_primary"]:
                # Promote next photo to primary
                next_photo = await conn.fetchrow(
                    "SELECT id, url FROM cat_photos WHERE cat_id = $1 ORDER BY display_order ASC LIMIT 1",
                    cat_id,
                )
                if next_photo:
                    await conn.execute(
                        "UPDATE cat_photos SET is_primary = true WHERE id = $1", next_photo["id"]
                    )
                    await conn.execute(
                        "UPDATE cats SET photo_url = $1 WHERE id = $2", next_photo["url"], cat_id
                    )
                else:
                    await conn.execute(
                        "UPDATE cats SET photo_url = NULL WHERE id = $1", cat_id
                    )

    if photo["r2_key"] and settings.r2_account_id:
        try:
            delete_file(photo["r2_key"])
        except Exception:
            pass  # Best-effort R2 cleanup; row is already deleted
