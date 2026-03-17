from pydantic import BaseModel, HttpUrl, field_validator
from datetime import datetime
from typing import Literal

EventType = Literal["aukcja", "zbiórka", "wolontariat", "pro-bono", "event"]


class PartnerIn(BaseModel):
    name: str
    initials: str
    color_class: str = "bg-stone-100 text-stone-600"
    year: int
    event_name: str
    event_type: EventType
    description: str | None = None
    impact: str | None = None
    website_url: str | None = None
    sort_order: int = 0

    @field_validator("initials")
    @classmethod
    def initials_length(cls, v: str) -> str:
        if not 1 <= len(v) <= 3:
            raise ValueError("initials must be 1–3 characters")
        return v.upper()


class PartnerPatch(BaseModel):
    name: str | None = None
    initials: str | None = None
    color_class: str | None = None
    year: int | None = None
    event_name: str | None = None
    event_type: EventType | None = None
    description: str | None = None
    impact: str | None = None
    website_url: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class PartnerOut(BaseModel):
    id: int
    name: str
    initials: str
    color_class: str
    year: int
    event_name: str
    event_type: str
    description: str | None
    impact: str | None
    website_url: str | None
    is_active: bool
    sort_order: int
    created_at: datetime
