from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.db.queries import fetch_one, fetch_all, execute
from app.db.session import get_pool
from app.models.fundraiser import FundraiserIn, FundraiserOut, FundraiserPatch
from app.dependencies import require_admin
import asyncpg

router = APIRouter()

_SELECT = (
    "SELECT f.id, f.cat_id, f.title, f.description, f.goal_amount, f.raised_amount, "
    "f.is_active, f.created_at, f.closed_at, c.name as cat_name "
    "FROM fundraisers f LEFT JOIN cats c ON c.id = f.cat_id"
)


@router.get("/", response_model=list[FundraiserOut])
async def list_fundraisers(
    pool: asyncpg.Pool = Depends(get_pool),
    cat_id: int | None = None,
    active_only: bool = True,
):
    conditions = []
    params = []
    if active_only:
        conditions.append("f.is_active = true")
    if cat_id is not None:
        conditions.append(f"f.cat_id = ${len(params) + 1}")
        params.append(cat_id)
    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    rows = await fetch_all(
        pool, f"{_SELECT} {where} ORDER BY f.created_at DESC", *params
    )
    return [dict(r) for r in rows]


@router.get("/{fundraiser_id}", response_model=FundraiserOut)
async def get_fundraiser(fundraiser_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(pool, f"{_SELECT} WHERE f.id = $1", fundraiser_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fundraiser not found")
    return dict(row)


@router.post("/", response_model=FundraiserOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def create_fundraiser(payload: FundraiserIn, pool: asyncpg.Pool = Depends(get_pool)):
    if payload.cat_id is not None:
        cat = await fetch_one(pool, "SELECT id FROM cats WHERE id = $1", payload.cat_id)
        if not cat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cat not found")
    row = await fetch_one(
        pool,
        "INSERT INTO fundraisers (cat_id, title, description, goal_amount) "
        "VALUES ($1, $2, $3, $4) RETURNING id, cat_id, title, description, "
        "goal_amount, raised_amount, is_active, created_at, closed_at",
        payload.cat_id, payload.title, payload.description, payload.goal_amount,
    )
    result = dict(row)
    result["cat_name"] = None
    if payload.cat_id:
        cat_row = await fetch_one(pool, "SELECT name FROM cats WHERE id = $1", payload.cat_id)
        if cat_row:
            result["cat_name"] = cat_row["name"]
    return result


@router.patch("/{fundraiser_id}", response_model=FundraiserOut,
              dependencies=[Depends(require_admin)])
async def patch_fundraiser(
    fundraiser_id: int, payload: FundraiserPatch, pool: asyncpg.Pool = Depends(get_pool)
):
    existing = await fetch_one(
        pool, "SELECT id, is_active FROM fundraisers WHERE id = $1", fundraiser_id
    )
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fundraiser not found")

    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    # Auto-set closed_at when is_active flips to false
    if updates.get("is_active") is False and existing["is_active"]:
        updates["closed_at"] = "__now__"
    elif updates.get("is_active") is True:
        updates["closed_at"] = None

    parts = []
    values = [fundraiser_id]
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
        f"UPDATE fundraisers SET {set_clause} WHERE id = $1 "
        "RETURNING id, cat_id, title, description, goal_amount, raised_amount, "
        "is_active, created_at, closed_at",
        *values,
    )
    result = dict(row)
    cat_name_row = await fetch_one(
        pool, "SELECT name FROM cats WHERE id = $1", result["cat_id"]
    ) if result["cat_id"] else None
    result["cat_name"] = cat_name_row["name"] if cat_name_row else None
    return result


@router.delete("/{fundraiser_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_fundraiser(fundraiser_id: int, pool: asyncpg.Pool = Depends(get_pool)):
    result = await execute(pool, "DELETE FROM fundraisers WHERE id = $1", fundraiser_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fundraiser not found")
