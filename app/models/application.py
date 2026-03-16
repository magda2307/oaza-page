from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ApplicationIn(BaseModel):
    cat_id: int
    message: str | None = None


class ApplicationStatus(BaseModel):
    status: Literal["pending", "approved", "rejected"]


class ApplicationOut(BaseModel):
    id: int
    user_id: int
    cat_id: int
    message: str | None
    status: str
    created_at: datetime
