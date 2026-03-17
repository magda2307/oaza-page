import uuid
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.config import settings
from app.db.session import create_pool, close_pool, get_pool
from app.models.errors import ErrorDetail, ErrorResponse
from app.routers import auth, cats, applications, admin, photos, contact, stories, cat_photos, fundraisers, newsletter, partners

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger("oaza")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_pool()
    yield
    await close_pool()


tags_metadata = [
    {"name": "cats", "description": "Public cat listings and profiles."},
    {"name": "applications", "description": "Adoption applications for registered users."},
    {"name": "admin", "description": "Admin: manage applications, cats, and users."},
    {"name": "auth", "description": "Registration and login. Returns a JWT Bearer token."},
    {"name": "photos", "description": "Admin photo upload to Cloudflare R2."},
    {"name": "health", "description": "Infrastructure liveness probe."},
    {"name": "contact", "description": "Public contact form submission."},
    {"name": "stories", "description": "Adoption success stories."},
    {"name": "cat-photos", "description": "Cat photo gallery management."},
    {"name": "fundraisers", "description": "Per-cat fundraiser tracking."},
    {"name": "newsletter", "description": "Newsletter subscription management."},
    {"name": "partners", "description": "Corporate partners and charity event showcase."},
]

app = FastAPI(
    title="Oaza Adoption API",
    version="0.1.0",
    description=(
        "REST API for Kocia Oaza, a Polish cat-charity adoption platform. "
        "Public endpoints are read-only. Authenticated endpoints require a "
        "Bearer JWT from POST /auth/login. Admin endpoints require is_admin=true in the token."
    ),
    lifespan=lifespan,
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        start = time.monotonic()
        response = await call_next(request)
        duration_ms = round((time.monotonic() - start) * 1000)
        response.headers["X-Request-Id"] = request_id
        logger.info(
            "%s %s %s %dms rid=%s",
            request.method, request.url.path, response.status_code, duration_ms, request_id,
        )
        return response


app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestIdMiddleware)


_ERROR_MAP = {
    400: "bad_request", 401: "unauthorized", 403: "forbidden",
    404: "not_found", 409: "conflict", 413: "payload_too_large",
    415: "unsupported_media_type", 503: "service_unavailable",
}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    details = [
        ErrorDetail(
            field=".".join(str(loc) for loc in e["loc"]),
            message=e["msg"],
            code=e["type"],
        )
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="validation_error",
            message="Request body is invalid.",
            details=details,
        ).model_dump(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content=ErrorResponse(
            error=_ERROR_MAP.get(exc.status_code, "error"),
            message=exc.detail if isinstance(exc.detail, str) else str(exc.detail),
        ).model_dump(),
    )


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(cats.router, prefix="/cats", tags=["cats"])
app.include_router(applications.router, prefix="/applications", tags=["applications"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(photos.router, prefix="/photos", tags=["photos"])
app.include_router(contact.router, prefix="/contact", tags=["contact"])
app.include_router(stories.router, prefix="/stories", tags=["stories"])
app.include_router(cat_photos.router, prefix="/cats/{cat_id}/photos", tags=["cat-photos"])
app.include_router(fundraisers.router, prefix="/fundraisers", tags=["fundraisers"])
app.include_router(newsletter.router, prefix="/newsletter", tags=["newsletter"])
app.include_router(partners.router, prefix="/partners", tags=["partners"])


@app.get("/podatek", tags=["misc"], include_in_schema=False)
async def podatek():
    return RedirectResponse(url=settings.podatek_redirect_url, status_code=302)


@app.get("/health", tags=["health"])
async def health():
    pool = get_pool()
    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ok"}
    except Exception as exc:
        from fastapi import status as http_status
        raise HTTPException(
            status_code=http_status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        ) from exc
