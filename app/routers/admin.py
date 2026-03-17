from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status
from typing import Literal
from app.db.queries import fetch_all, fetch_one
from app.db.session import get_pool
from app.models.application import ApplicationOut, ApplicationStatus
from app.models.cat import CatOut
from app.dependencies import require_admin
import asyncpg

router = APIRouter()


@router.get("/applications", response_model=list[ApplicationOut],
            dependencies=[Depends(require_admin)])
async def list_all_applications(
    pool: asyncpg.Pool = Depends(get_pool),
    status: Literal["pending", "approved", "rejected"] | None = None,
    cat_id: int | None = None,
    user_id: int | None = None,
):
    base = (
        "SELECT a.id, a.user_id, a.cat_id, a.message, a.status, a.created_at, "
        "c.name as cat_name, c.photo_url as cat_photo_url, u.email as user_email "
        "FROM applications a "
        "JOIN cats c ON c.id = a.cat_id "
        "JOIN users u ON u.id = a.user_id"
    )
    conditions = []
    params = []
    if status is not None:
        params.append(status)
        conditions.append(f"a.status = ${len(params)}")
    if cat_id is not None:
        params.append(cat_id)
        conditions.append(f"a.cat_id = ${len(params)}")
    if user_id is not None:
        params.append(user_id)
        conditions.append(f"a.user_id = ${len(params)}")
    query = base
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " ORDER BY a.created_at DESC"
    rows = await fetch_all(pool, query, *params)
    return [dict(r) for r in rows]


@router.patch("/applications/{application_id}", response_model=ApplicationOut,
              dependencies=[Depends(require_admin)])
async def update_application_status(
    application_id: int,
    payload: ApplicationStatus,
    pool: asyncpg.Pool = Depends(get_pool),
):
    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                "UPDATE applications SET status = $2 WHERE id = $1 "
                "RETURNING id, user_id, cat_id, message, status, created_at",
                application_id, payload.status,
            )
            if not row:
                raise HTTPException(
                    status_code=http_status.HTTP_404_NOT_FOUND, detail="Application not found"
                )
            if payload.status == "approved":
                await conn.execute(
                    "UPDATE cats SET is_adopted = true WHERE id = $1", row["cat_id"]
                )
    return dict(row)


@router.get("/cats", response_model=list[CatOut], dependencies=[Depends(require_admin)])
async def list_all_cats(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    rows = await fetch_all(
        pool,
        "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
        "FROM cats ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        limit, offset,
    )
    return [dict(r) for r in rows]


@router.get("/stats", dependencies=[Depends(require_admin)])
async def admin_stats(pool: asyncpg.Pool = Depends(get_pool)):
    cats_row = await fetch_one(
        pool,
        "SELECT "
        "COUNT(*) FILTER (WHERE NOT is_adopted) as cats_available, "
        "COUNT(*) FILTER (WHERE is_adopted) as cats_adopted "
        "FROM cats",
    )
    apps_row = await fetch_one(
        pool,
        "SELECT "
        "COUNT(*) FILTER (WHERE status = 'pending') as applications_pending, "
        "COUNT(*) FILTER (WHERE status = 'approved') as applications_approved, "
        "COUNT(*) FILTER (WHERE status = 'rejected') as applications_rejected "
        "FROM applications",
    )
    users_row = await fetch_one(
        pool,
        "SELECT COUNT(*) as registrations_this_month FROM users "
        "WHERE created_at >= date_trunc('month', now())",
    )
    return {
        "cats_available": cats_row["cats_available"],
        "cats_adopted": cats_row["cats_adopted"],
        "applications_pending": apps_row["applications_pending"],
        "applications_approved": apps_row["applications_approved"],
        "applications_rejected": apps_row["applications_rejected"],
        "registrations_this_month": users_row["registrations_this_month"],
    }


@router.get("/contact", dependencies=[Depends(require_admin)])
async def list_contact_submissions(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    rows = await fetch_all(
        pool,
        "SELECT id, name, email, message, created_at FROM contact_submissions "
        "ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        limit, offset,
    )
    return [dict(r) for r in rows]
