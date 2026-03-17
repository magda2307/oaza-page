from fastapi import APIRouter, Depends, HTTPException, status
from app.db.queries import fetch_one, execute
from app.db.session import get_pool
from app.models.auth import UserRegister, UserLogin, Token, TokenData
from app.services.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
import asyncpg

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, pool: asyncpg.Pool = Depends(get_pool)):
    existing = await fetch_one(
        pool, "SELECT id FROM users WHERE email = $1", payload.email
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    hashed = hash_password(payload.password)
    row = await fetch_one(
        pool,
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, is_admin",
        payload.email,
        hashed,
    )
    token = create_access_token(row["id"], row["is_admin"])
    return Token(access_token=token)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, pool: asyncpg.Pool = Depends(get_pool)):
    row = await fetch_one(
        pool,
        "SELECT id, hashed_password, is_admin FROM users WHERE email = $1",
        payload.email,
    )
    if not row or not verify_password(payload.password, row["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_access_token(row["id"], row["is_admin"])
    return Token(access_token=token)


@router.get("/me")
async def me(current_user: TokenData = Depends(get_current_user)):
    return {"id": current_user.user_id, "is_admin": current_user.is_admin}
