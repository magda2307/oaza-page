from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.partner import PartnerIn, PartnerOut, PartnerPatch
from app.models.pagination import Page
from app.dependencies import require_admin
import asyncio
import asyncpg

router = APIRouter()

_SELECT = (
    "SELECT id, name, initials, color_class, year, event_name, event_type, "
    "description, impact, website_url, is_active, sort_order, created_at "
    "FROM partners"
)


@router.get("/", response_model=Page[PartnerOut])
async def list_partners(
    pool: asyncpg.Pool = Depends(get_pool),
    year: int | None = None,
    event_type: str | None = None,
    active_only: bool = True,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=100),
):
    offset = (page - 1) * limit
    conditions: list[str] = []
    params: list = []

    if active_only:
        conditions.append("is_active = true")
    if year is not None:
        conditions.append(f"year = ${len(params) + 1}")
        params.append(year)
    if event_type is not None:
        conditions.append(f"event_type = ${len(params) + 1}")
        params.append(event_type)

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    full_params = params + [limit, offset]

    rows, count_row = await asyncio.gather(
        fetch_all(
            pool,
            f"{_SELECT} {where} ORDER BY sort_order ASC, year DESC, id DESC "
            f"LIMIT ${len(params) + 1} OFFSET ${len(params) + 2}",
            *full_params,
        ),
        fetch_one(pool, f"SELECT COUNT(*) as total FROM partners {where}", *params),
    )
    return Page.build([dict(r) for r in rows], count_row["total"], page, limit)


@router.get("/{partner_id}", response_model=PartnerOut)
async def get_partner(partner_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(pool, f"{_SELECT} WHERE id = $1", partner_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")
    return dict(row)


@router.post(
    "/",
    response_model=PartnerOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_partner(payload: PartnerIn, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "INSERT INTO partners "
        "(name, initials, color_class, year, event_name, event_type, "
        "description, impact, website_url, sort_order) "
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) "
        "RETURNING id, name, initials, color_class, year, event_name, event_type, "
        "description, impact, website_url, is_active, sort_order, created_at",
        payload.name,
        payload.initials,
        payload.color_class,
        payload.year,
        payload.event_name,
        payload.event_type,
        payload.description,
        payload.impact,
        payload.website_url,
        payload.sort_order,
    )
    return dict(row)


@router.patch(
    "/{partner_id}",
    response_model=PartnerOut,
    dependencies=[Depends(require_admin)],
)
async def patch_partner(
    partner_id: int,
    payload: PartnerPatch,
    pool: asyncpg.Pool = Depends(get_pool),
):
    existing = await fetch_one(pool, "SELECT id FROM partners WHERE id = $1", partner_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")

    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    parts = []
    values = [partner_id]
    i = 2
    for k, v in updates.items():
        parts.append(f"{k} = ${i}")
        values.append(v)
        i += 1

    row = await fetch_one(
        pool,
        f"UPDATE partners SET {', '.join(parts)} WHERE id = $1 "
        "RETURNING id, name, initials, color_class, year, event_name, event_type, "
        "description, impact, website_url, is_active, sort_order, created_at",
        *values,
    )
    return dict(row)


@router.delete(
    "/{partner_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_partner(partner_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(pool, "DELETE FROM partners WHERE id = $1", partner_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partner not found")
