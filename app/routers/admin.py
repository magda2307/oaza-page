import asyncio
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from fastapi import status as http_status
from typing import Literal
from app.db.queries import fetch_all, fetch_one
from app.db.session import get_pool
from app.models.application import ApplicationOut, ApplicationStatus
from app.models.auth import TokenData
from app.models.cat import CatOut
from app.models.pagination import Page
from app.dependencies import require_admin
from app.services.email import send_application_status_email
import asyncpg

router = APIRouter()


@router.get("/applications", response_model=Page[ApplicationOut],
            dependencies=[Depends(require_admin)])
async def list_all_applications(
    pool: asyncpg.Pool = Depends(get_pool),
    status: Literal["pending", "approved", "rejected"] | None = None,
    cat_id: int | None = None,
    user_id: int | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    base = (
        "SELECT a.id, a.user_id, a.cat_id, a.message, a.status, a.created_at,"
        "  a.housing_type, a.has_outdoor_access, a.owns_property,"
        "  a.adults_count, a.children_ages, a.other_pets, a.all_household_agree,"
        "  a.had_cats_before, a.previous_cats_fate, a.has_vet,"
        "  a.hours_alone_per_day, a.is_indoor_only,"
        "  a.motivation, a.home_visit_agreement,"
        "  c.name as cat_name, c.photo_url as cat_photo_url, u.email as user_email "
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
    count_base = "SELECT COUNT(*) as total FROM applications a JOIN cats c ON c.id = a.cat_id JOIN users u ON u.id = a.user_id"
    count_query = count_base + (" WHERE " + " AND ".join(conditions) if conditions else "")
    full_query = query + f" LIMIT ${len(params)+1} OFFSET ${len(params)+2}"
    params_with_page = params + [limit, offset]

    rows, count_row = await asyncio.gather(
        fetch_all(pool, full_query, *params_with_page),
        fetch_one(pool, count_query, *params),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.patch("/applications/{application_id}", response_model=ApplicationOut,
              dependencies=[Depends(require_admin)])
async def update_application_status(
    application_id: int,
    payload: ApplicationStatus,
    background_tasks: BackgroundTasks,
    pool: asyncpg.Pool = Depends(get_pool),
):
    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                "UPDATE applications SET status = $2 WHERE id = $1 "
                "RETURNING id, user_id, cat_id, message, status, created_at,"
                "  housing_type, has_outdoor_access, owns_property,"
                "  adults_count, children_ages, other_pets, all_household_agree,"
                "  had_cats_before, previous_cats_fate, has_vet,"
                "  hours_alone_per_day, is_indoor_only,"
                "  motivation, home_visit_agreement",
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

    if payload.status in ("approved", "rejected"):
        user_row, cat_row = await asyncio.gather(
            fetch_one(pool, "SELECT email FROM users WHERE id = $1", row["user_id"]),
            fetch_one(pool, "SELECT name FROM cats WHERE id = $1", row["cat_id"]),
        )
        if user_row and cat_row:
            background_tasks.add_task(
                send_application_status_email,
                user_row["email"],
                cat_row["name"],
                payload.status,
            )

    return dict(row)


@router.get("/cats", response_model=Page[CatOut], dependencies=[Depends(require_admin)])
async def list_all_cats(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    rows, count_row = await asyncio.gather(
        fetch_all(
            pool,
            "SELECT id, name, age_years, sex, breed, description, photo_url, is_adopted, tags, created_at "
            "FROM cats ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            limit, offset,
        ),
        fetch_one(pool, "SELECT COUNT(*) as total FROM cats"),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.get("/stats", dependencies=[Depends(require_admin)])
async def admin_stats(pool: asyncpg.Pool = Depends(get_pool)):
    cats_row, apps_row, users_row, stories_row, fundraisers_row = await asyncio.gather(
        fetch_one(
            pool,
            "SELECT COUNT(*) FILTER (WHERE NOT is_adopted) as cats_available, "
            "COUNT(*) FILTER (WHERE is_adopted) as cats_adopted FROM cats",
        ),
        fetch_one(
            pool,
            "SELECT "
            "COUNT(*) FILTER (WHERE status = 'pending') as applications_pending, "
            "COUNT(*) FILTER (WHERE status = 'approved') as applications_approved, "
            "COUNT(*) FILTER (WHERE status = 'rejected') as applications_rejected "
            "FROM applications",
        ),
        fetch_one(
            pool,
            "SELECT COUNT(*) as registrations_this_month FROM users "
            "WHERE created_at >= date_trunc('month', now())",
        ),
        fetch_one(
            pool,
            "SELECT COUNT(*) FILTER (WHERE is_published) as published, "
            "COUNT(*) FILTER (WHERE NOT is_published) as drafts FROM success_stories",
        ),
        fetch_one(
            pool,
            "SELECT COUNT(*) FILTER (WHERE is_active) as active, "
            "COALESCE(SUM(raised_amount), 0) as total_raised FROM fundraisers",
        ),
    )
    return {
        "cats_available": cats_row["cats_available"],
        "cats_adopted": cats_row["cats_adopted"],
        "applications_pending": apps_row["applications_pending"],
        "applications_approved": apps_row["applications_approved"],
        "applications_rejected": apps_row["applications_rejected"],
        "registrations_this_month": users_row["registrations_this_month"],
        "stories_published": stories_row["published"],
        "stories_drafts": stories_row["drafts"],
        "fundraisers_active": fundraisers_row["active"],
        "total_raised": str(fundraisers_row["total_raised"]),
    }


@router.get("/contact", dependencies=[Depends(require_admin)])
async def list_contact_submissions(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    rows, count_row = await asyncio.gather(
        fetch_all(
            pool,
            "SELECT id, name, email, message, created_at FROM contact_submissions "
            "ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            limit, offset,
        ),
        fetch_one(pool, "SELECT COUNT(*) as total FROM contact_submissions"),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    offset = (page - 1) * limit
    rows, count_row = await asyncio.gather(
        fetch_all(
            pool,
            "SELECT id, email, is_admin, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            limit, offset,
        ),
        fetch_one(pool, "SELECT COUNT(*) as total FROM users"),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.patch("/users/{user_id}", dependencies=[Depends(require_admin)])
async def toggle_user_admin(
    user_id: int,
    pool: asyncpg.Pool = Depends(get_pool),
    current_user: TokenData = Depends(require_admin),
):
    if user_id == current_user.user_id:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own admin status",
        )
    row = await fetch_one(
        pool,
        "UPDATE users SET is_admin = NOT is_admin WHERE id = $1 "
        "RETURNING id, email, is_admin, created_at",
        user_id,
    )
    if not row:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="User not found")
    return dict(row)


@router.get("/fundraisers", dependencies=[Depends(require_admin)])
async def list_all_fundraisers(
    pool: asyncpg.Pool = Depends(get_pool),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    cat_id: int | None = None,
):
    offset = (page - 1) * limit
    base = (
        "SELECT f.id, f.cat_id, f.title, f.description, f.goal_amount, f.raised_amount, "
        "f.is_active, f.created_at, f.closed_at, c.name as cat_name "
        "FROM fundraisers f LEFT JOIN cats c ON c.id = f.cat_id"
    )
    if cat_id is not None:
        rows, count_row = await asyncio.gather(
            fetch_all(
                pool,
                f"{base} WHERE f.cat_id = $1 ORDER BY f.created_at DESC LIMIT $2 OFFSET $3",
                cat_id, limit, offset,
            ),
            fetch_one(pool, "SELECT COUNT(*) as total FROM fundraisers WHERE cat_id = $1", cat_id),
        )
    else:
        rows, count_row = await asyncio.gather(
            fetch_all(
                pool,
                f"{base} ORDER BY f.created_at DESC LIMIT $1 OFFSET $2",
                limit, offset,
            ),
            fetch_one(pool, "SELECT COUNT(*) as total FROM fundraisers"),
        )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)
