from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import fetch_one, fetch_all
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
        "SELECT id, user_id, cat_id, message, status, created_at "
        "FROM applications WHERE user_id = $1 ORDER BY created_at DESC",
        current_user.user_id,
    )
    return [dict(r) for r in rows]
