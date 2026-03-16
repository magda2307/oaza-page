from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db.session import create_pool, close_pool
from app.routers import auth, cats, applications, admin, photos


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_pool()
    yield
    await close_pool()


app = FastAPI(title="Catcharity API", lifespan=lifespan)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(cats.router, prefix="/cats", tags=["cats"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(photos.router, prefix="/photos", tags=["photos"])


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
