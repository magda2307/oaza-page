from pydantic import BaseModel
from datetime import datetime


class StoryIn(BaseModel):
    cat_name: str
    adopter_name: str | None = None
    title: str
    story: str
    photo_url: str | None = None
    is_published: bool = False


class StoryPatch(BaseModel):
    cat_name: str | None = None
    adopter_name: str | None = None
    title: str | None = None
    story: str | None = None
    photo_url: str | None = None
    is_published: bool | None = None


class StoryOut(BaseModel):
    id: int
    cat_name: str
    adopter_name: str | None
    title: str
    story: str
    photo_url: str | None
    is_published: bool
    published_at: datetime | None
    created_at: datetime
