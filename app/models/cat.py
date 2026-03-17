from pydantic import BaseModel
from datetime import datetime


class CatIn(BaseModel):
    name: str
    age_years: float | None = None
    sex: str | None = None
    breed: str | None = None
    description: str | None = None
    photo_url: str | None = None
    tags: list[str] = []


class CatPatch(BaseModel):
    name: str | None = None
    age_years: float | None = None
    sex: str | None = None
    breed: str | None = None
    description: str | None = None
    photo_url: str | None = None
    is_adopted: bool | None = None
    tags: list[str] | None = None


class CatOut(BaseModel):
    id: int
    name: str
    age_years: float | None
    sex: str | None
    breed: str | None
    description: str | None
    photo_url: str | None
    is_adopted: bool
    tags: list[str]
    created_at: datetime
