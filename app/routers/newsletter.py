import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.pagination import Page
from app.dependencies import require_admin
from pydantic import BaseModel, EmailStr
import asyncpg

router = APIRouter()


class SubscribeIn(BaseModel):
    email: EmailStr
    name: str | None = None


@router.post("/subscribe", status_code=status.HTTP_201_CREATED)
async def subscribe(payload: SubscribeIn, pool: asyncpg.Pool = Depends(get_pool)):
    existing = await fetch_one(
        pool, "SELECT id, is_active FROM newsletter_subscribers WHERE email = $1", payload.email
    )
    if existing:
        if existing["is_active"]:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already subscribed")
        await execute(
            pool,
            "UPDATE newsletter_subscribers SET is_active = true, name = $2 WHERE email = $1",
            payload.email, payload.name,
        )
        return {"ok": True, "reactivated": True}
    await execute(
        pool,
        "INSERT INTO newsletter_subscribers (email, name) VALUES ($1, $2)",
        payload.email, payload.name,
    )
    return {"ok": True, "reactivated": False}


@router.delete("/unsubscribe", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(email: str, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(
        pool,
        "UPDATE newsletter_subscribers SET is_active = false WHERE email = $1 AND is_active = true",
        email,
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")


@router.get("/admin", dependencies=[Depends(require_admin)])
async def list_subscribers(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
    active_only: bool = True,
):
    offset = (page - 1) * limit
    if active_only:
        rows, count_row = await asyncio.gather(
            fetch_all(
                pool,
                "SELECT id, email, name, is_active, created_at FROM newsletter_subscribers "
                "WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2",
                limit, offset,
            ),
            fetch_one(pool, "SELECT COUNT(*) as total FROM newsletter_subscribers WHERE is_active = true"),
        )
    else:
        rows, count_row = await asyncio.gather(
            fetch_all(
                pool,
                "SELECT id, email, name, is_active, created_at FROM newsletter_subscribers "
                "ORDER BY created_at DESC LIMIT $1 OFFSET $2",
                limit, offset,
            ),
            fetch_one(pool, "SELECT COUNT(*) as total FROM newsletter_subscribers"),
        )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)
