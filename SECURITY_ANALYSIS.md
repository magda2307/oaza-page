# Security Analysis Report: Oaza FastAPI Application

**Date:** 2025-03-17
**Scope:** FastAPI backend + PostgreSQL + Cloudflare R2 integration
**Focus:** Breach and DDoS vulnerabilities

---

## Executive Summary

The application demonstrates **solid foundational security practices** with parameterized queries and proper JWT authentication. However, **critical gaps in rate limiting, logging, and operational security** create significant risks for both brute-force attacks (breach) and denial-of-service conditions.

**Critical Issues:** 2
**High Issues:** 5
**Medium Issues:** 7
**Low Issues:** 3

---

## 🔴 CRITICAL ISSUES

### 1. **No Rate Limiting on Authentication Endpoints**

**Severity:** CRITICAL (Brute-force vulnerability)

**Location:** `app/routers/auth.py` (POST /auth/register, POST /auth/login)

**Description:**
- `/auth/register` and `/auth/login` have zero rate limiting
- Attacker can perform unlimited login attempts in seconds
- No protection against credential stuffing, password enumeration, or account takeover
- First-time attacker can try **thousands of password combinations in minutes**

**Attack Scenario:**
```bash
# Attacker targets known emails from OSINT/data breaches
for i in {1..10000}; do
  curl -X POST http://api.example.com/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@example.com\",\"password\":\"password$i\"}" &
done
```

**Impact:**
- Account takeover (admin or user)
- Credential stuffing success
- Data breach via compromised accounts
- Denial of service (CPU/disk exhaustion from login failures)

**Recommendations:**
1. **Implement per-email rate limiting** (e.g., 5 failed attempts per 15 minutes)
2. **Implement per-IP rate limiting** (e.g., 20 requests per minute to /auth)
3. **Add exponential backoff** or account lockout after N failures
4. **Use FastAPI-Limiter** or Slowapi middleware:
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address

   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter

   @limiter.limit("5/15 minutes")
   @router.post("/login")
   async def login(payload: UserLogin, ...):
       ...
   ```
5. **Log failed login attempts** with email + IP for analysis
6. **Add CAPTCHA** after 3 failed attempts from same IP

**Business Impact:** Medium (financial loss + user trust erosion)

---

### 2. **Public List of User Email Addresses (GET /admin/users)**

**Severity:** CRITICAL (Information Disclosure + Account Enumeration)

**Location:** `app/routers/admin.py` (lines 163-175)

**Description:**
- Endpoint `/admin/users` requires admin auth but **returns all user emails** in order
- Combined with `/auth/register` (which indicates if email exists), attacker can:
  1. Enumerate all registered users
  2. **Verify which emails are valid** via registration endpoint
  3. Perform targeted phishing with full user list
  4. **GDPR violation** — exposing user data unnecessarily

**Current Code:**
```python
@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users(pool, page, limit):
    rows = await fetch_all(pool, "SELECT id, email, is_admin, created_at ...")
    return [dict(r) for r in rows]  # ← Returns ALL emails including personal data
```

**Attack Scenario:**
1. Breach the admin account (via brute force from Issue #1)
2. Call GET /admin/users → get full user directory
3. Export all emails for phishing campaigns

**Impact:**
- Complete user database exposure if admin is compromised
- GDPR/privacy regulation violation
- Phishing target list
- User enumeration before focused attacks

**Recommendations:**
1. **Remove `/admin/users` entirely** or paginate/filter to only admins' own user info
2. **If admin dashboard needs user data**, return only anonymized stats:
   ```json
   {
     "total_users": 1234,
     "admins": 5,
     "users_registered_this_month": 42
   }
   ```
3. **Never expose full email lists** in API responses
4. **Add audit logging** to /admin/users calls (if kept)
5. **Implement row-level security** in database (PostgreSQL policies)

**GDPR/Privacy Impact:** HIGH — this violates data minimization principles

---

## 🟠 HIGH ISSUES

### 3. **No Audit Logging for Admin Actions**

**Severity:** HIGH (Breach Detection Gap + Compliance)

**Location:** All admin endpoints (`/admin/*`, `/photos/upload`, `/stories/*`)

**Description:**
- **Zero logging** of admin actions (create/update/delete cats, approve applications, toggle user admin status)
- Attacker with compromised admin account can:
  1. Modify/delete cat records silently
  2. Approve/reject applications without trace
  3. Escalate other users to admin without audit trail
  4. **No way to detect the breach after the fact**

**Missing Audit Trail:**
- Who changed what data
- When (timestamp)
- From where (IP address)
- What values changed (before/after)

**Regulation Impact:** Non-compliance with:
- **GDPR** (Article 5.1f — accountability)
- **PCI DSS** (if handling payments)
- **HIPAA** (if co-processing health data for FIV/FeLV cats)

**Recommendations:**
```python
# Create audit_log table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES users(id),
  action VARCHAR(50),  -- 'CREATE_CAT', 'UPDATE_APP', 'TOGGLE_ADMIN'
  resource_type VARCHAR(50),  -- 'cat', 'application', 'user'
  resource_id INT,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

# Log before/after state
@router.patch("/applications/{application_id}")
async def update_application_status(application_id: int, payload: ApplicationStatus, ...):
    async with pool.acquire() as conn:
        async with conn.transaction():
            # Get old state
            old_row = await conn.fetchrow(
                "SELECT * FROM applications WHERE id = $1", application_id
            )

            # Update
            new_row = await conn.fetchrow(
                "UPDATE applications SET status = $2 WHERE id = $1 ...",
                application_id, payload.status
            )

            # Audit log
            await conn.execute(
                """INSERT INTO audit_logs
                   (admin_id, action, resource_type, resource_id, old_value, new_value, ip_address)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)""",
                current_user.user_id, "UPDATE_APPLICATION", "application",
                application_id, dict(old_row), dict(new_row),
                request.client.host
            )
```

**Business Impact:** HIGH (compliance + incident response cost)

---

### 4. **JWT Token Expiry Too Long (24 hours) + No Token Revocation**

**Severity:** HIGH (Account Takeover Window + Privilege Escalation)

**Location:** `app/config.py` (line 8) and `app/services/auth.py` (lines 18-23)

**Issues:**
1. **24-hour token lifetime** is excessive for sensitive operations
   - Stolen token valid for **full day** even after password change
   - User can't logout (stateless JWT means no revocation possible)
   - Compromised token hard to mitigate

2. **No "logout" endpoint**
   - Client can't invalidate tokens
   - User password changed but **old token still works** for 24 hours
   - **Privilege escalation not reversible** — if admin role removed, token still grants access

3. **Token stored in localStorage** (frontend issue, but backend doesn't help)
   - Vulnerable to XSS attacks
   - No HttpOnly flag (controlled by frontend, but should recommend it)

**Scenario:**
```
1. Attacker gets token (via XSS or interception)
2. User changes password but token STILL WORKS for 24 hours
3. User removes attacker from admin — but old token STILL GRANTS ADMIN ACCESS
4. Organization has no way to force logout
```

**Recommendations:**
1. **Reduce token expiry** to 15-30 minutes:
   ```python
   # In app/config.py
   access_token_expire_minutes: int = 15  # Down from 1440
   refresh_token_expire_days: int = 7
   ```

2. **Implement token revocation** (blacklist or rotation):
   ```python
   # Add token_blacklist table
   CREATE TABLE token_blacklist (
     id SERIAL PRIMARY KEY,
     jti VARCHAR(255),  -- JWT ID claim
     user_id INT,
     blacklisted_at TIMESTAMP DEFAULT now(),
     expires_at TIMESTAMP
   );

   # On logout, add to blacklist
   @router.post("/auth/logout")
   async def logout(current_user: TokenData = Depends(get_current_user), ...):
       await execute(pool,
           "INSERT INTO token_blacklist (jti, user_id, expires_at) VALUES ($1, $2, $3)",
           request.headers.get("X-Token-ID"),  # Pass JTI in token
           current_user.user_id,
           datetime.now(timezone.utc) + timedelta(hours=24)
       )
       return {"ok": True}

   # Check blacklist in decode_token
   def decode_token(token: str) -> TokenData:
       payload = jwt.decode(...)
       # Check if JTI in blacklist...
   ```

3. **Add refresh token rotation**:
   - Short-lived access token (15 min)
   - Longer-lived refresh token (7 days, rotated on use)
   - Limits blast radius of leaked tokens

4. **Add JTI (JWT ID) claim** for token-level revocation:
   ```python
   def create_access_token(user_id: int, is_admin: bool) -> str:
       jti = str(uuid4())  # Unique token ID
       expire = datetime.now(timezone.utc) + timedelta(minutes=15)
       payload = {
           "sub": str(user_id),
           "is_admin": is_admin,
           "jti": jti,
           "exp": expire
       }
       return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
   ```

5. **Force logout on admin status change**:
   ```python
   # When toggling admin, also add their current tokens to blacklist
   @router.patch("/users/{user_id}")
   async def toggle_user_admin(user_id, ..., current_user, pool):
       if user_id == current_user.user_id:
           raise HTTPException(...)

       # Blacklist all current tokens for this user
       await execute(pool,
           """DELETE FROM token_blacklist WHERE user_id = $1;
              INSERT INTO token_blacklist (jti, user_id, expires_at)
              SELECT jti, user_id, expires_at FROM ... WHERE user_id = $1""",
           user_id
       )

       # Update admin status
       ...
   ```

**Business Impact:** CRITICAL — extended account takeover window

---

### 5. **No HTTPS Enforcement or Security Headers**

**Severity:** HIGH (Man-in-the-Middle & Client Compromise)

**Description:**
- No `HTTPS_ONLY` enforcement in FastAPI app
- No security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- Tokens sent over HTTP → interceptable
- Frontend can be framed/injected

**Missing Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Recommendations:**
```python
# In app/main.py, add after CORS middleware
from fastapi.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Also require HTTPS in production:
# 1. Deploy behind HTTPS reverse proxy (nginx)
# 2. Set: X-Forwarded-Proto header validation
# 3. In FastAPI, redirect HTTP → HTTPS
```

**Business Impact:** HIGH (token interception, MITM attacks)

---

### 6. **SQL Injection Risk in Dynamic Query Building (PATCH /cats/{cat_id})**

**Severity:** HIGH (Potential Breach)

**Location:** `app/routers/cats.py` (lines 206-213)

**Issue:**
```python
# VULNERABLE - field names not validated!
updates = payload.model_dump(exclude_none=True)
set_clause = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(updates))  # ← k is NOT escaped
values = list(updates.values())
query = f"UPDATE cats SET {set_clause} WHERE id = $1 ..."
```

While values are parameterized, **field names are not validated**. If Pydantic model validation fails or bypassed:

**Attack:**
```python
# If attacker can add fields to payload (e.g., via prototype pollution or JSON manipulation):
payload.model_dump() → {"name": "Fluffy", "photo_url": "; DROP TABLE users; --"}
# Query becomes:
# UPDATE cats SET name = $2, photo_url = $3; DROP TABLE users; -- WHERE id = $1
```

**Mitigation:**
```python
# Whitelist allowed fields
ALLOWED_UPDATE_FIELDS = {"name", "age_years", "sex", "breed", "description", "photo_url", "tags", "is_adopted"}

@router.patch("/{cat_id}")
async def patch_cat(cat_id: int, payload: CatPatch, pool: asyncpg.Pool = Depends(get_pool)):
    updates = payload.model_dump(exclude_none=True)

    # Validate field names
    for key in updates:
        if key not in ALLOWED_UPDATE_FIELDS:
            raise HTTPException(400, f"Invalid field: {key}")

    # Rest of code (already safe from value injection)
    set_clause = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(updates))
    ...
```

**Current Likelihood:** LOW (Pydantic model is strict), but **good defensive practice**

**Business Impact:** HIGH (data breach if bypassed)

---

### 7. **No Request Size Limits (DoS via Large Payloads)**

**Severity:** HIGH (Denial of Service)

**Location:** `app/main.py` — FastAPI app initialization

**Description:**
- No `max_body_size` limit in FastAPI configuration
- Attacker can send **gigabyte-sized JSON bodies** to:
  - Exhaust server memory
  - Crash application
  - Trigger database connection pool exhaustion

**Attack:**
```bash
# Send 1GB JSON payload
python3 << 'EOF'
import requests
huge_payload = {"message": "A" * (1024 * 1024 * 1024)}  # 1GB
requests.post("http://api.example.com/applications/", json=huge_payload)
EOF
```

**Recommendations:**
```python
# In app/main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError

# Add request size middleware
class LimitUploadSize(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        self.max_upload_size = max_upload_size
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        if request.method == "POST" or request.method == "PATCH":
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > self.max_upload_size:
                return JSONResponse(
                    status_code=413,
                    content={"error": "Request entity too large"}
                )
        return await call_next(request)

# Add to FastAPI app
app.add_middleware(LimitUploadSize, max_upload_size=1024 * 1024)  # 1MB limit
```

Also limit query string size:
```python
# nginx.conf or reverse proxy
client_max_body_size 1M;
```

**Business Impact:** HIGH (availability loss)

---

## 🟡 MEDIUM ISSUES

### 8. **Missing Database Connection Timeout (Connection Pool Exhaustion)**

**Severity:** MEDIUM (Denial of Service)

**Location:** `app/db/session.py`

**Description:**
- Asyncpg pool has default connection timeout, but **no idle connection timeout**
- Attacker can:
  1. Open many slow requests that hold connections
  2. Exhaust pool (max 20 connections default)
  3. New requests queue indefinitely
  4. Service becomes unavailable

**Example Attack:**
```bash
# Open many hanging requests
for i in {1..20}; do
  curl "http://api.example.com/cats/1?sleep=9999" &
done
# All 20 pool connections now held, new requests hang
```

**Recommendation:**
```python
# In app/db/session.py
async def create_pool():
    pool = await asyncpg.create_pool(
        settings.database_url,
        min_size=5,
        max_size=20,
        max_queries=50000,
        max_cached_statement_lifetime=300,
        max_cacheable_statement_size=15000,
        command_timeout=30.0,  # ← Add timeout
    )
    return pool

# Add query timeout in database operations
async def fetch_one(pool, query, *args):
    async with pool.acquire() as conn:
        return await asyncio.wait_for(
            conn.fetchrow(query, *args),
            timeout=10.0  # ← Add timeout
        )
```

Also add at middleware level:
```python
@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    try:
        return await asyncio.wait_for(call_next(request), timeout=30.0)
    except asyncio.TimeoutError:
        return JSONResponse({"error": "Request timeout"}, status_code=504)
```

---

### 9. **No Logging or Monitoring**

**Severity:** MEDIUM (Incident Response Gap)

**Description:**
- No application logs captured
- No errors logged to persistent storage
- No metrics/monitoring (request count, error rate, latency)
- **Attackers are invisible** — no way to detect:
  - Brute force attacks
  - SQL injection attempts
  - Data exfiltration
  - Privilege escalation

**Recommendations:**
```python
# Add structured logging with python-json-logger
import logging
from pythonjsonlogger import jsonlogger

# Setup logging
logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Log important events
@router.post("/auth/login")
async def login(payload: UserLogin, ..., request: Request):
    logger.info("login_attempt", extra={
        "email": payload.email,
        "ip": request.client.host,
        "timestamp": datetime.utcnow()
    })

    if not verify:
        logger.warning("login_failed", extra={
            "email": payload.email,
            "ip": request.client.host
        })
```

Also add:
- **APM (Application Performance Monitoring)** — NewRelic, Datadog
- **Error tracking** — Sentry
- **Database query monitoring** — slow query log
- **Infrastructure monitoring** — CPU/memory/disk alerts

---

### 10. **No Input Validation on Contact Form (Spam/Abuse)**

**Severity:** MEDIUM (Denial of Service + Abuse)

**Location:** `app/routers/contact.py`

**Description:**
- Only validates message length (≥10 chars)
- No rate limiting on contact form
- No spam detection
- Attacker can flood database with millions of contact submissions

**Recommendations:**
```python
# Add rate limiting
@limiter.limit("5/hour")
@router.post("/")
async def submit_contact(payload: ContactIn, ...):
    ...

# Add email validation more strictly
from email_validator import validate_email, EmailNotValidError

@router.post("/")
async def submit_contact(payload: ContactIn, ...):
    try:
        validate_email(payload.email, check_deliverability=True)
    except EmailNotValidError:
        raise HTTPException(400, "Invalid email address")

    # Add honeypot field (hidden from users, catches bots)
    # Add CAPTCHA verification
    # Add content filtering for spam keywords
```

---

### 11. **Error Messages Leak Information**

**Severity:** MEDIUM (Information Disclosure)

**Location:** All routers

**Current Error:**
```json
{"error": "bad_request", "message": "Request body is invalid.", "details": [...]}
```

**Issue:**
- Detailed error messages can reveal:
  - Database structure (column names in validation)
  - Authentication logic ("Invalid or expired token" reveals token validation happens)
  - Data presence ("Email already registered" confirms user enumeration)

**Recommendations:**
```python
# Sanitize error messages in production
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    # In production, hide details
    if settings.environment == "production":
        message = exc.detail if exc.status_code < 500 else "Internal server error"
        # Don't expose validation details
    else:
        message = exc.detail

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": _ERROR_MAP.get(exc.status_code, "error"), "message": message}
    )
```

---

### 12. **Admin Status Toggle Endpoint Missing More Checks**

**Severity:** MEDIUM (Privilege Escalation Risk)

**Location:** `app/routers/admin.py` (lines 178-197)

**Issue:**
```python
# Good: prevents self-toggle
if user_id == current_user.user_id:
    raise HTTPException(...)

# Missing: What if Last Admin tries to remove own admin?
# Missing: Audit log who toggled admin status
# Missing: Rate limiting on this sensitive operation
```

**Add:**
```python
@router.patch("/users/{user_id}")
async def toggle_user_admin(...):
    # Ensure at least one admin exists
    admin_count = await fetch_val(pool, "SELECT COUNT(*) FROM users WHERE is_admin = true")
    if admin_count == 1 and current_user.user_id == user_id:
        raise HTTPException(400, "Cannot remove last admin")

    # Log the change
    old = await fetch_one(pool, "SELECT is_admin FROM users WHERE id = $1", user_id)
    new = await fetch_one(pool, "UPDATE users SET is_admin = NOT is_admin WHERE id = $1 ...", user_id)

    await log_audit_event(pool, current_user.user_id, "TOGGLE_ADMIN", user_id, old, new)
```

---

### 13. **CORS Allows Credentials with Multiple Origins**

**Severity:** MEDIUM (Token Theft via CORS)

**Location:** `app/main.py` (line 48)

**Current:**
```python
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_allowed_origins, allow_credentials=True)
```

**Issue:**
- If `allow_credentials=True` with wildcard or broad `allow_origins`, credentials leaked to untrusted sites
- Current config restricted to `localhost:3000` but should validate

**Recommendation:**
```python
# Strict CORS in production
cors_origins = settings.cors_allowed_origins
if "*" in cors_origins and settings.environment == "production":
    raise ValueError("Wildcard CORS not allowed with credentials in production")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,  # Only if we NEED cookies/auth headers
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
    expose_headers=["X-Total-Count"]  # Only expose necessary headers
)
```

---

## 🔵 LOW ISSUES

### 14. **No Request ID Correlation for Debugging**

**Severity:** LOW (Operational)

**Description:**
- No X-Request-ID header added to responses
- Hard to correlate logs across microservices
- Incident response slower

**Recommendation:**
```python
import uuid

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response
```

---

### 15. **Cloudflare R2 Keys Not Rotated**

**Severity:** LOW (Key Compromise Risk)

**Location:** `app/config.py` (R2 credentials)

**Description:**
- R2 API keys read from `.env` file on startup
- No key rotation policy
- Compromised key can't be revoked without restart

**Recommendation:**
- Rotate R2 keys every 90 days
- Use AWS Secrets Manager / HashiCorp Vault for key rotation
- Add key rotation alert in monitoring

---

### 16. **Missing Security.txt**

**Severity:** LOW (Security Disclosure)

**Description:**
- No `/.well-known/security.txt` file
- Researchers can't report vulnerabilities through standard channels

**Add:**
```python
@app.get("/.well-known/security.txt", include_in_schema=False)
async def security_txt():
    return """Contact: security@example.com
Expires: 2025-12-31T23:59:00.000Z
Preferred-Languages: en
Canonical: https://example.com/.well-known/security.txt
"""
```

---

## 📋 Summary Table: Prioritized Remediation

| Priority | Issue | Effort | Impact | Status |
|---|---|---|---|---|
| **P0** | Rate limiting on auth | 2hrs | CRITICAL | ❌ Not started |
| **P0** | Remove /admin/users endpoint | 1hr | CRITICAL | ❌ Not started |
| **P1** | Add audit logging | 8hrs | HIGH | ❌ Not started |
| **P1** | Reduce JWT expiry + add revocation | 6hrs | CRITICAL | ❌ Not started |
| **P1** | Add security headers + HTTPS enforcement | 2hrs | HIGH | ❌ Not started |
| **P1** | Request size limits (DoS protection) | 1hr | HIGH | ❌ Not started |
| **P2** | DB connection timeout | 1hr | MEDIUM | ❌ Not started |
| **P2** | Structured logging | 4hrs | MEDIUM | ❌ Not started |
| **P2** | Contact form spam filters | 2hrs | MEDIUM | ❌ Not started |
| **P3** | Error message sanitization | 2hrs | LOW | ❌ Not started |

---

## 🛡️ Quick Wins (1-2 hours each)

1. **Add Slowapi rate limiter** to auth endpoints
2. **Disable GET /admin/users** (or make admin-only)
3. **Add security headers middleware**
4. **Set request size limits**
5. **Add X-Request-ID middleware**

---

## Deployment Checklist

- [ ] Enable HTTPS only (deploy behind nginx/reverse proxy)
- [ ] Set `SECRET_KEY` to cryptographically strong value (min 32 bytes)
- [ ] Configure CORS for production domain only
- [ ] Enable database SSL connections
- [ ] Set up structured logging (→ centralized log aggregation)
- [ ] Configure APM/error tracking (Sentry)
- [ ] Enable database backups
- [ ] Set up incident response runbook
- [ ] Test disaster recovery / restore from backups

---

## References & Tools

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **FastAPI Security:** https://fastapi.tiangolo.com/tutorial/security/
- **Rate Limiting:** https://github.com/laurentS/slowapi
- **Audit Logging:** https://github.com/twyle/audit-log
- **Error Tracking:** https://sentry.io/
- **Logging:** https://pypi.org/project/python-json-logger/

