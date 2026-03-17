from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import execute
from app.db.session import get_pool
from pydantic import BaseModel, EmailStr
import asyncpg

router = APIRouter()


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_contact(payload: ContactIn, pool: asyncpg.Pool = Depends(get_pool)):
    if len(payload.message.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message must be at least 10 characters",
        )
    await execute(
        pool,
        "INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)",
        payload.name, payload.email, payload.message,
    )
    return {"ok": True}
