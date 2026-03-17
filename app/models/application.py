from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Literal


class ApplicationIn(BaseModel):
    cat_id: int
    # Free-text notes (optional)
    message: str | None = None

    # Mieszkanie
    housing_type: Literal["dom", "mieszkanie", "inne"] | None = None
    has_outdoor_access: bool | None = None
    owns_property: bool | None = None

    # Domownicy
    adults_count: int | None = None
    children_ages: str | None = None
    other_pets: str | None = None
    all_household_agree: bool | None = None

    # Doświadczenie
    had_cats_before: bool | None = None
    previous_cats_fate: str | None = None
    has_vet: bool | None = None

    # Tryb życia
    hours_alone_per_day: int | None = None
    is_indoor_only: bool | None = None

    # Motywacja
    motivation: str | None = None
    home_visit_agreement: bool | None = None

    @field_validator("hours_alone_per_day")
    @classmethod
    def validate_hours(cls, v):
        if v is not None and not (0 <= v <= 24):
            raise ValueError("hours_alone_per_day must be between 0 and 24")
        return v

    @field_validator("adults_count")
    @classmethod
    def validate_adults(cls, v):
        if v is not None and v < 1:
            raise ValueError("adults_count must be at least 1")
        return v


class ApplicationStatus(BaseModel):
    status: Literal["pending", "approved", "rejected"]


class ApplicationOut(BaseModel):
    id: int
    user_id: int
    cat_id: int
    status: str
    created_at: datetime

    # Free-text
    message: str | None = None

    # Mieszkanie
    housing_type: str | None = None
    has_outdoor_access: bool | None = None
    owns_property: bool | None = None

    # Domownicy
    adults_count: int | None = None
    children_ages: str | None = None
    other_pets: str | None = None
    all_household_agree: bool | None = None

    # Doświadczenie
    had_cats_before: bool | None = None
    previous_cats_fate: str | None = None
    has_vet: bool | None = None

    # Tryb życia
    hours_alone_per_day: int | None = None
    is_indoor_only: bool | None = None

    # Motywacja
    motivation: str | None = None
    home_visit_agreement: bool | None = None

    # Joined fields (populated by admin/mine endpoints)
    cat_name: str | None = None
    cat_photo_url: str | None = None
    user_email: str | None = None
