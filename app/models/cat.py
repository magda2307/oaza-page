from pydantic import BaseModel
from datetime import datetime


class CatIn(BaseModel):
    name: str
    age_years: float | None = None
    breed: str | None = None
    description: str | None = None
    photo_url: str | None = None


class CatPatch(BaseModel):
    name: str | None = None
    age_years: float | None = None
    breed: str | None = None
    description: str | None = None
    photo_url: str | None = None
    is_adopted: bool | None = None


class CatOut(BaseModel):
    id: int
    name: str
    age_years: float | None
    breed: str | None
    description: str | None
    photo_url: str | None
    is_adopted: bool
    created_at: datetime
