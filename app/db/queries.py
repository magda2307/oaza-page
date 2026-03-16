from typing import Any
import asyncpg


async def fetch_one(
    pool: asyncpg.Pool, query: str, *args: Any
) -> asyncpg.Record | None:
    async with pool.acquire() as conn:
        return await conn.fetchrow(query, *args)


async def fetch_all(
    pool: asyncpg.Pool, query: str, *args: Any
) -> list[asyncpg.Record]:
    async with pool.acquire() as conn:
        return await conn.fetch(query, *args)


async def execute(pool: asyncpg.Pool, query: str, *args: Any) -> str:
    async with pool.acquire() as conn:
        return await conn.execute(query, *args)


async def fetch_val(pool: asyncpg.Pool, query: str, *args: Any) -> Any:
    async with pool.acquire() as conn:
        return await conn.fetchval(query, *args)
