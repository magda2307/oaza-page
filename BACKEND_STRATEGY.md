# Oaza — Backend API Strategy

> Analysis date: 2026-03-17. Reviewed files: `app/main.py`, `app/routers/*`, `app/models/*`,
> `app/dependencies.py`, `app/services/auth.py`, `app/db/queries.py`,
> `migrations/versions/001_initial.py`, `migrations/versions/002_cat_tags.py`.

---

## 1. API Design Assessment

### What Is Working Well

**Router structure and tagging.** The five routers (`auth`, `cats`, `applications`, `admin`,
`photos`) are cleanly separated with proper prefix and tag registration in `main.py`. This maps
directly to the OpenAPI tag groupings with no extra configuration needed.

**Partial update pattern.** `CatPatch.model_dump(exclude_none=True)` + dynamic `SET` clause in
`patch_cat` is the correct Pydantic v2 approach for sparse PATCH semantics. It avoids
accidentally nulling fields the client did not include.

**Conflict semantics on applications.** The duplicate-pending-application check in
`submit_application` uses `409 Conflict`, which is the correct status code and saves the admin
from sifting duplicate submissions.

**Photo upload validation.** Content-type allowlist (`image/jpeg`, `image/png`, `image/webp`,
`image/gif`) and the 10 MB cap in `photos.py` are enforced before the R2 call, which is the
right order. The UUID filename strategy (`cats/{uuid4}.ext`) prevents path traversal and naming
collisions.

**Tags as a native Postgres `TEXT[]` column.** Migration 002 uses a proper array column rather
than a comma-separated string or a join table. asyncpg will return this as a Python `list[str]`
directly, which Pydantic v2 serialises correctly.

**HTTP status codes are correct throughout.** `201` on POST, `204` on DELETE, `401` with
`WWW-Authenticate: Bearer`, `403` for admin-only access, `409` for business-logic conflicts,
`415` for unsupported media type, `413` for oversize uploads. Nothing to change here.

**bcrypt with passlib.** `CryptContext(schemes=["bcrypt"], deprecated="auto")` is the standard
approach and will silently re-hash on login if the cost factor is ever upgraded.

---

### Problems Found in the Existing Code

#### P1 — Critical: CORS middleware is absent

`app/main.py` does not register `CORSMiddleware`. Every browser request from the Next.js
frontend (different origin) will be blocked by the browser preflight check. This must be the
first thing added before the project can be used end-to-end.

#### P2 — Critical: Application status approval is not atomic

In `admin.py` lines 40–57, the application status update and the subsequent cat adoption update
are two separate `await execute()` calls with no transaction:

```python
# admin.py  — current (unsafe)
row = await fetch_one(pool, "UPDATE applications SET status = $2 WHERE id = $1 ...", ...)
if payload.status == "approved":
    await execute(pool, "UPDATE cats SET is_adopted = true WHERE id = $1", row["cat_id"])
```

If the process crashes or the pool connection drops between the two statements, the application
is marked `approved` but the cat remains available for further applications. Because both
statements touch different rows, a single `BEGIN/COMMIT` in asyncpg is sufficient:

```python
async with pool.acquire() as conn:
    async with conn.transaction():
        row = await conn.fetchrow("UPDATE applications ...", ...)
        if payload.status == "approved":
            await conn.execute("UPDATE cats SET is_adopted = true ...", row["cat_id"])
```

The existing `fetch_one` / `execute` helpers each open and close their own connection, so the
transactional path must acquire a connection directly. This does not require changing the helpers
— it is a one-off pattern only in this handler.

#### P3 — High: `GET /cats/` is completely unfiltered and unbounded

The query is:
```sql
SELECT ... FROM cats WHERE is_adopted = false ORDER BY created_at DESC
```

There is no filtering by `tags`, `breed`, age range, or sex. There is no `LIMIT`/`OFFSET` or
cursor. As the cat list grows this returns everything in one payload, and the frontend has no way
to implement a tag-based browsing experience without client-side filtering on the full dataset.

#### P4 — High: Admin has no visibility into adopted cats

`GET /cats/` always filters `is_adopted = false`. There is no way for an admin to retrieve the
full cat inventory including previously adopted animals. This blocks the admin dashboard from
showing adoption history.

#### P5 — Medium: `GET /admin/applications` returns only foreign-key IDs

`ApplicationOut` exposes `user_id: int` and `cat_id: int`. The admin dashboard cannot display
"Paula applied for Mruczek" without making additional round-trips to `GET /cats/{id}` and a
hypothetical user-info endpoint. This is an N+1 problem at the API contract level.

#### P6 — Medium: `status_filter` in admin applications accepts arbitrary strings

```python
async def list_all_applications(status_filter: str | None = None):
```

A request to `GET /admin/applications?status_filter=banana` silently returns zero results with
a `200 OK`. The parameter should use the same `Literal["pending", "approved", "rejected"]` that
`ApplicationStatus` already defines, so FastAPI generates a 422 on invalid input automatically.

Note the parameter name inconsistency: the query string key must currently be sent as
`?status_filter=` not `?status=`, which contradicts the documented description.

#### P7 — Medium: No `sex` field on the cat model

The `cats` table and `CatIn`/`CatOut` models have no field for the cat's sex (male/female/
neutered/unknown). This is a standard adoption listing attribute that adopters filter on.

#### P8 — Medium: Health check does not probe the database

```python
@app.get("/health")
async def health():
    return {"status": "ok"}
```

This returns `200` even if the Postgres pool has failed. A useful liveness/readiness probe
should run a lightweight `SELECT 1` and return `503` if the pool is unavailable.

#### P9 — Low: `GET /applications/mine` does not include cat name

`ApplicationOut` returns `cat_id: int`. A user viewing their own applications sees an ID, not
"Your application for Mruczek is pending." The endpoint should join with `cats` and return at
minimum `cat_name: str`.

#### P10 — Low: Token expiry is 24 hours with no refresh mechanism

`access_token_expire_minutes = 1440`. There is no refresh token. After 24 hours the frontend
silently fails all authenticated requests. For an NGO this is tolerable short-term, but for
adopters who start an application and return later it is confusing UX.

#### P11 — Low: Orphaned photos on cat deletion

`DELETE /cats/{id}` removes the database row but the R2 object at the `photo_url` key remains.
For a small NGO with a modest photo volume this is a cost non-issue, but it should be tracked as
known technical debt.

---

## 2. Endpoint Gaps

The following routes are needed to support the documented frontend page map and the Oaza
business requirements. Organised by priority.

### Sprint 1 — Blocking the frontend

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| — | CORS middleware | — | Unblocks all browser requests (see section 6) |
| GET | `/cats/` | public | Add `?tags=`, `?sex=`, `?age_min=`, `?age_max=`, `?page=`, `?limit=` query params |
| GET | `/cats/` | admin | Add `?include_adopted=true` to allow admin to see full inventory |
| GET | `/auth/me` | bearer | Return `{id, email, is_admin}` so the frontend can verify token validity and show the correct nav state without decoding the JWT client-side |

### Sprint 2 — Homepage and public content

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/stats` | public | `{cats_available: int, cats_adopted: int, applications_pending: int}` — feeds the homepage counter. Single SQL query: `SELECT COUNT(*) FILTER (WHERE NOT is_adopted), COUNT(*) FILTER (WHERE is_adopted) FROM cats` |
| GET | `/cats/tags` | public | Distinct list of all tags currently in use, sorted by frequency. Feeds the filter pill UI on `/koty`. Query: `SELECT unnest(tags), count(*) FROM cats WHERE NOT is_adopted GROUP BY 1 ORDER BY 2 DESC` |
| POST | `/contact` | public | Accepts `{name, email, message}`. Stores in a `contact_submissions` table. No email delivery needed on day one — the admin can query it. Guards: rate-limit by IP (see section below), honeypot field, minimum message length. |

### Sprint 3 — Adopter experience

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/applications/mine` | bearer | Enrich response: add `cat_name`, `cat_photo_url` to each row via JOIN |
| DELETE | `/applications/{id}` | bearer | Allow the applicant to withdraw a `pending` application. Must verify `user_id` matches token to prevent cross-user deletion. |
| GET | `/admin/applications` | admin | Rename `?status_filter=` to `?status=`, apply `Literal` validation, add `?cat_id=` and `?user_id=` filters |
| GET | `/admin/applications` | admin | Enrich response: add `cat_name`, `user_email` to each row via JOIN |

### Sprint 4 — Admin operations

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/admin/cats` | admin | Same as `GET /cats/` but `WHERE` clause omits `is_adopted = false` filter. Returns full inventory with pagination. Avoids needing the `?include_adopted` flag on the public route. |
| GET | `/admin/contact` | admin | Paginated list of contact submissions |
| GET | `/admin/stats` | admin | Extended stats: applications by status, registrations this month, etc. |
| DELETE | `/admin/photos/{key}` | admin | Delete an object from R2 by key. Allows admins to clean up orphaned uploads. |

### Polish-specific requirements

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/podatek` | public | 302 redirect to the official `podatki.gov.pl` 1.5% transfer URL for the NGO. Keeps the URL under the Oaza domain, allows the link to be updated in one place (env var `PODATEK_REDIRECT_URL`). |

The blog (`/blog`, `/blog/[slug]`) and static content pages (`/jak-adoptowac`, `/o-nas`,
`/wspieraj`, `/prywatnosc`, `/regulamin`) do not require API endpoints. They should be
implemented as Next.js static pages or MDX files on the frontend side. Adding a CMS or database-
backed blog endpoint is premature for an NGO at this scale.

---

## 3. Versioning Strategy

**Recommendation: do not add URI versioning at this stage.**

URI versioning (`/v1/cats/`) adds friction with no current benefit. There is one frontend
consumer, one backend team, and no public API contract with third parties. The cost of
maintaining two route trees would exceed any benefit for the foreseeable lifetime of this
project.

**When to add versioning.** If any of the following occurs, introduce `/v1/` via router prefix:
- A mobile app or third-party integration is planned that you cannot redeploy in sync with the
  backend.
- A breaking schema change (e.g. renaming `age_years` to `age_months`, or restructuring
  `ApplicationOut`) cannot be coordinated with the frontend deploy.
- The API is opened publicly (partner shelters, volunteer developers).

**Deprecation policy for the current codebase.** Until then, manage breaking changes through
coordinated deploys (backend and frontend in the same release). Document field removals or
renames in the git commit message with a `BREAKING:` prefix so they appear clearly in `git log`.

**If versioning becomes necessary.** Add a `v1` prefix to every router at the `include_router`
call in `main.py`:

```python
app.include_router(cats.router, prefix="/v1/cats", tags=["cats"])
```

This requires zero changes to the router files themselves. Mount the old unversioned routers
alongside with a deprecation response header (`Deprecation: true`, `Sunset: <date>`) for a
transition period, then remove them.

---

## 4. OpenAPI / Docs Strategy

FastAPI generates an OpenAPI 3.1 spec automatically at `/openapi.json`, but the current
configuration produces a minimal, untitled output. The following additions make the Swagger UI
at `/docs` production-useful for the team.

### 4.1 Application metadata

In `main.py`, expand the `FastAPI(...)` constructor:

```python
app = FastAPI(
    title="Oaza Adoption API",
    version="0.1.0",
    description=(
        "REST API for Kocia Oaza, a Polish cat-charity adoption platform. "
        "Public endpoints are read-only. Authenticated endpoints require a "
        "Bearer JWT obtained from POST /auth/login. Admin endpoints require "
        "is_admin=true in the token."
    ),
    contact={"name": "Oaza Tech", "email": "tech@kocia-oaza.pl"},
    license_info={"name": "Private — internal use only"},
)
```

### 4.2 Security scheme

Add a global Bearer security scheme so the "Authorize" button appears in Swagger UI:

```python
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi

# Or simpler: FastAPI picks up the HTTPBearer() from dependencies automatically.
# Verify by checking that /openapi.json contains:
# components.securitySchemes.HTTPBearer.type = "http", scheme = "bearer"
```

FastAPI will include the scheme automatically once `HTTPBearer()` is referenced in any
dependency. Confirm it is present in the generated spec before shipping.

### 4.3 Response documentation on every endpoint

Every router function should declare all non-2xx responses it can return. FastAPI does not
introspect `raise HTTPException` calls:

```python
@router.get(
    "/{cat_id}",
    response_model=CatOut,
    responses={
        404: {"description": "Cat not found", "model": ErrorResponse},
    },
)
```

Minimum: document `400`, `401`, `403`, `404`, `409`, `413`, `415` where each is raised.

### 4.4 Field-level descriptions on Pydantic models

Add `Field(description="...")` to models that are directly exposed in the OpenAPI schema.
Priority fields:

```python
class CatIn(BaseModel):
    name: str = Field(..., description="Cat's given name, e.g. 'Mruczek'")
    age_years: float | None = Field(None, description="Age in years; 0.5 = ~6 months. Null if unknown.")
    tags: list[str] = Field([], description="Searchable labels: 'fiv', 'felv', 'senior', 'kitten', etc.")
```

### 4.5 Tag descriptions

Register tag metadata so the Swagger UI groups endpoints with human-readable descriptions:

```python
tags_metadata = [
    {"name": "cats", "description": "Public cat listings and profiles."},
    {"name": "applications", "description": "Adoption application submission and status for registered users."},
    {"name": "admin", "description": "Admin-only: manage applications, cats, and users."},
    {"name": "auth", "description": "Registration and login. Returns a JWT Bearer token."},
    {"name": "photos", "description": "Admin photo upload to Cloudflare R2."},
    {"name": "health", "description": "Infrastructure liveness probe."},
]
app = FastAPI(..., openapi_tags=tags_metadata)
```

### 4.6 Disable docs in production (optional)

If the API will ever be publicly reachable, consider restricting `/docs` and `/redoc` in
production. This is done by setting `docs_url=None, redoc_url=None` conditionally based on an
env var `ENABLE_DOCS=true/false`. For a private NGO deployment it is fine to leave them on.

---

## 5. Error Response Shape

### Current state

FastAPI's default error envelope is `{"detail": "..."}` where `detail` is a plain string for
application-raised `HTTPException`, or a list of validation error objects for Pydantic `422`
responses. The two shapes are incompatible with each other.

Example current 404:
```json
{"detail": "Cat not found"}
```

Example current 422 (Pydantic validation failure):
```json
{
  "detail": [
    {"loc": ["body", "cat_id"], "msg": "value is not a valid integer", "type": "type_error.integer"}
  ]
}
```

The frontend must branch on `typeof response.detail` to handle these two cases. This is
fragile.

### Recommended standard shape

Define a single error envelope used for every non-2xx response:

```python
# app/models/errors.py
from pydantic import BaseModel
from typing import Any

class ErrorDetail(BaseModel):
    field: str | None = None       # populated for validation errors
    message: str                   # human-readable, may be shown to end users
    code: str                      # machine-readable, never changes, safe to switch on

class ErrorResponse(BaseModel):
    error: str                     # short error category, e.g. "not_found"
    message: str                   # top-level human summary
    details: list[ErrorDetail] = []
```

Example 404:
```json
{
  "error": "not_found",
  "message": "Cat not found.",
  "details": []
}
```

Example 422 (validation):
```json
{
  "error": "validation_error",
  "message": "Request body is invalid.",
  "details": [
    {"field": "body.cat_id", "message": "value is not a valid integer", "code": "type_error.integer"}
  ]
}
```

Example 409 (duplicate application):
```json
{
  "error": "conflict",
  "message": "You already have a pending application for this cat.",
  "details": []
}
```

### Implementation approach

Override FastAPI's exception handlers in `main.py`:

```python
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    details = [
        ErrorDetail(
            field=".".join(str(l) for l in e["loc"]),
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
    error_map = {
        400: "bad_request", 401: "unauthorized", 403: "forbidden",
        404: "not_found", 409: "conflict", 413: "payload_too_large",
        415: "unsupported_media_type", 503: "service_unavailable",
    }
    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content=ErrorResponse(
            error=error_map.get(exc.status_code, "error"),
            message=exc.detail if isinstance(exc.detail, str) else str(exc.detail),
        ).model_dump(),
    )
```

### Error code catalog

The following machine-readable `code` values should be documented and kept stable:

| HTTP status | `error` value | Situation |
|---|---|---|
| 400 | `bad_request` | No fields to update in PATCH |
| 401 | `unauthorized` | Missing or expired JWT |
| 403 | `forbidden` | Valid JWT but not admin |
| 404 | `not_found` | Cat, application, or resource missing |
| 409 | `conflict` | Duplicate application; email already registered; cat already adopted |
| 413 | `payload_too_large` | Photo upload > 10 MB |
| 415 | `unsupported_media_type` | Non-image file uploaded |
| 422 | `validation_error` | Pydantic schema violation |
| 503 | `service_unavailable` | R2 not configured; DB pool unavailable |

---

## 6. CORS Configuration

### Current state

`app/main.py` contains no CORS configuration. Without `CORSMiddleware`, every browser preflight
(`OPTIONS`) request from the Next.js frontend will receive no `Access-Control-Allow-Origin`
header and the browser will block the actual request. This is a deploy blocker.

### Required configuration

Add the following to `main.py` immediately after the `FastAPI(...)` instantiation, before any
router is registered:

```python
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,   # list from env, see below
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["X-Request-Id"],               # add if request ID logging is added later
    max_age=600,                                   # preflight cache in seconds (10 min)
)
```

The middleware must be registered before routers. FastAPI applies middleware in reverse
registration order, but the canonical pattern is to register it first.

### `cors_allowed_origins` in settings

Add to `app/config.py`:

```python
cors_allowed_origins: list[str] = ["http://localhost:3000"]
```

In `.env.example`, document the production value:

```
# Comma-separated list of allowed frontend origins
# CORS_ALLOWED_ORIGINS=https://kocia-oaza.pl,https://www.kocia-oaza.pl
```

Pydantic-settings can parse a comma-separated env var into a `list[str]` with a custom validator
or by using `JSON` format in the env value:

```
CORS_ALLOWED_ORIGINS='["https://kocia-oaza.pl","https://www.kocia-oaza.pl"]'
```

### What to never do

Do not use `allow_origins=["*"]` with `allow_credentials=True`. The browser will reject
responses with a wildcard origin when credentials (the `Authorization` header) are included.
This combination will cause silent failures on all authenticated requests.

If you need to expose the API to unknown clients temporarily during development, use
`allow_origins=["*"]` with `allow_credentials=False` and keep it behind a feature flag.

### Security header baseline

While CORS is not a security mechanism by itself (it only instructs browsers), add the following
response headers to all requests via a small middleware or Nginx proxy layer:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

These are one-liners in FastAPI middleware or Nginx `add_header` directives and have no runtime
cost.

---

## Summary of Immediate Actions (ordered by impact)

1. Add `CORSMiddleware` to `main.py` — unblocks the frontend entirely.
2. Wrap the application approval handler in a Postgres transaction — prevents data inconsistency.
3. Add `?tags=`, `?sex=`, `?page=`, `?limit=` to `GET /cats/` — required for the `/koty` filter UI.
4. Add `GET /stats` — feeds the homepage cat counter.
5. Standardize error response shape with custom exception handlers.
6. Add `GET /auth/me` — frontend needs to verify token on load without decoding JWT client-side.
7. Fix `status_filter` param name and type in `GET /admin/applications`.
8. Add `sex` field to the cats schema and migration.
9. Enrich `ApplicationOut` with `cat_name` (for adopter view) and `user_email` (for admin view).
10. Add database probe to `GET /health`.
