from pydantic import BaseModel, Field
from datetime import datetime


class StoryIn(BaseModel):
    cat_name: str = Field(min_length=1, max_length=100)
    adopter_name: str | None = Field(default=None, max_length=100)
    title: str = Field(min_length=1, max_length=200)
    story: str = Field(min_length=10, max_length=5000)
    photo_url: str | None = None
    is_published: bool = False


class StoryPatch(BaseModel):
    cat_name: str | None = Field(default=None, min_length=1, max_length=100)
    adopter_name: str | None = Field(default=None, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    story: str | None = Field(default=None, min_length=10, max_length=5000)
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
