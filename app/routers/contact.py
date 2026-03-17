from fastapi import APIRouter, Depends, status
from app.db.queries import execute
from app.db.session import get_pool
from pydantic import BaseModel, EmailStr, Field
import asyncpg

router = APIRouter()


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=20, max_length=2000)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_contact(payload: ContactIn, pool: asyncpg.Pool = Depends(get_pool)):
    await execute(
        pool,
        "INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)",
        payload.name, payload.email, payload.message,
    )
    return {"ok": True}
