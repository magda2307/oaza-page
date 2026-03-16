from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import fetch_all, fetch_one, execute
from app.db.session import get_pool
from app.models.application import ApplicationOut, ApplicationStatus
from app.dependencies import require_admin
import asyncpg

router = APIRouter()


@router.get("/applications", response_model=list[ApplicationOut],
            dependencies=[Depends(require_admin)])
async def list_all_applications(
    pool: asyncpg.Pool = Depends(get_pool),
    status_filter: str | None = None,
):
    if status_filter:
        rows = await fetch_all(
            pool,
            "SELECT id, user_id, cat_id, message, status, created_at "
            "FROM applications WHERE status = $1 ORDER BY created_at DESC",
            status_filter,
        )
    else:
        rows = await fetch_all(
            pool,
            "SELECT id, user_id, cat_id, message, status, created_at "
            "FROM applications ORDER BY created_at DESC",
        )
    return [dict(r) for r in rows]


@router.patch("/applications/{application_id}", response_model=ApplicationOut,
              dependencies=[Depends(require_admin)])
async def update_application_status(
    application_id: int,
    payload: ApplicationStatus,
    pool: asyncpg.Pool = Depends(get_pool),
):
    row = await fetch_one(
        pool,
        "UPDATE applications SET status = $2 WHERE id = $1 "
        "RETURNING id, user_id, cat_id, message, status, created_at",
        application_id,
        payload.status,
    )
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )

    if payload.status == "approved":
        await execute(
            pool,
            "UPDATE cats SET is_adopted = true WHERE id = $1",
            row["cat_id"],
        )

    return dict(row)
