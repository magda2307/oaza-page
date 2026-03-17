from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.application import ApplicationIn, ApplicationOut
from app.dependencies import get_current_user
from app.models.auth import TokenData
import asyncpg

router = APIRouter()


@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def submit_application(
    payload: ApplicationIn,
    pool: asyncpg.Pool = Depends(get_pool),
    current_user: TokenData = Depends(get_current_user),
):
    cat = await fetch_one(
        pool, "SELECT id, is_adopted FROM cats WHERE id = $1", payload.cat_id
    )
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")
    if cat["is_adopted"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Cat is already adopted"
        )

    existing = await fetch_one(
        pool,
        "SELECT id FROM applications WHERE user_id = $1 AND cat_id = $2 AND status = 'pending'",
        current_user.user_id,
        payload.cat_id,
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending application for this cat",
        )

    row = await fetch_one(
        pool,
        "INSERT INTO applications (user_id, cat_id, message) VALUES ($1, $2, $3) "
        "RETURNING id, user_id, cat_id, message, status, created_at",
        current_user.user_id, payload.cat_id, payload.message,
    )
    return dict(row)


@router.get("/mine", response_model=list[ApplicationOut])
async def my_applications(
    pool: asyncpg.Pool = Depends(get_pool),
    current_user: TokenData = Depends(get_current_user),
):
    rows = await fetch_all(
        pool,
        "SELECT a.id, a.user_id, a.cat_id, a.message, a.status, a.created_at, "
        "c.name as cat_name, c.photo_url as cat_photo_url "
        "FROM applications a "
        "JOIN cats c ON c.id = a.cat_id "
        "WHERE a.user_id = $1 ORDER BY a.created_at DESC",
        current_user.user_id,
    )
    return [dict(r) for r in rows]


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def withdraw_application(
    application_id: int,
    pool: asyncpg.Pool = Depends(get_pool),
    current_user: TokenData = Depends(get_current_user),
):
    row = await fetch_one(
        pool,
        "SELECT id, user_id, status FROM applications WHERE id = $1",
        application_id,
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if row["user_id"] != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your application")
    if row["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending applications can be withdrawn",
        )
    await execute(pool, "DELETE FROM applications WHERE id = $1", application_id)
