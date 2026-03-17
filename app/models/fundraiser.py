from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class FundraiserIn(BaseModel):
    cat_id: int | None = None
    title: str
    description: str | None = None
    goal_amount: Decimal | None = None


class FundraiserPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    goal_amount: Decimal | None = None
    raised_amount: Decimal | None = None
    is_active: bool | None = None


class FundraiserOut(BaseModel):
    id: int
    cat_id: int | None
    title: str
    description: str | None
    goal_amount: Decimal | None
    raised_amount: Decimal
    is_active: bool
    created_at: datetime
    closed_at: datetime | None
    # Optional joined field
    cat_name: str | None = None
