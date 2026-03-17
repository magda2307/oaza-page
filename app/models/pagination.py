from __future__ import annotations
import math
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    pages: int
    limit: int

    @classmethod
    def build(cls, items: list, total: int, page: int, limit: int) -> "Page":
        pages = math.ceil(total / limit) if limit else 0
        return cls(items=items, total=total, page=page, pages=pages, limit=limit)
