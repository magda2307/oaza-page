from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class CatIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    age_years: float | None = None
    sex: Literal["m", "f", "unknown"] | None = None
    breed: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=3000)
    photo_url: str | None = None
    tags: list[str] = []


class CatPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    age_years: float | None = None
    sex: Literal["m", "f", "unknown"] | None = None
    breed: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=3000)
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


from app.models.cat_photo import CatPhotoOut
from app.models.fundraiser import FundraiserOut


class CatDetailOut(CatOut):
    photos: list[CatPhotoOut] = []
    fundraiser: FundraiserOut | None = None
