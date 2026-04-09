# Kocia Oaza

A full-stack adoption platform for a Polish cat charity that takes cats no one else will — FIV+, FeLV+, post-accident, senior, terminally ill. Built to replace a collection of Google Docs and static pages with a proper product.

---

## Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI · asyncpg · Alembic · Python 3.12 |
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Storage | PostgreSQL 16 · Cloudflare R2 (photos) |
| Auth | JWT (python-jose · passlib/bcrypt) |
| Infra | Docker · Docker Compose |

---

## Architecture

```
oaza-page/
├── app/                  # FastAPI application
│   ├── routers/          # auth · cats · applications · admin
│   │   ·                 # contact · stories · cat_photos
│   │   ·                 # fundraisers · newsletter · partners
│   ├── models/           # Pydantic request/response schemas
│   ├── services/         # business logic layer
│   └── db/               # asyncpg pool + query helpers
├── migrations/           # Alembic — 10 versioned migrations
├── frontend/             # Next.js App Router
│   ├── app/              # file-based routing
│   ├── components/       # reusable UI components
│   ├── lib/              # API client · formatters · helpers
│   └── types/            # shared TypeScript types
└── docker-compose.yml    # Postgres + API
```

---

## What's implemented

### Backend

- **Auth** — register/login with JWT; `is_admin` flag gates admin routes
- **Cats** — full CRUD (admin); public listing with tag filtering; per-cat photo gallery
- **Adoption applications** — authenticated submission; duplicate-guard; admin review + approve/reject (approval auto-marks cat as adopted)
- **Success stories** — admin-managed adoption outcomes shown publicly
- **Fundraisers** — per-cat fundraiser tracking with goal/raised amounts
- **Contact form** — public submission stored in DB
- **Newsletter** — email subscription with confirmation token
- **Partners** — charity partners and corporate sponsors
- **Photo upload** — admin-only; validates MIME type + size (max 10 MB); uploads to Cloudflare R2; graceful 503 if R2 not configured
- **Middleware** — CORS, security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`), per-request UUID logging with duration
- **Error handling** — uniform `{ error, message, details }` envelope for all 4xx/5xx responses

### Database (10 Alembic migrations)

`users` → `cats` (+ `tags[]`, `sex`) → `applications` (+ extended fields) → `contact_submissions` → `success_stories` → `cat_photos` → `fundraisers` → `newsletter_subscriptions` → `partners`

### Frontend

- **Landing page** — animated stats, cat carousel, diagnosis explainer, adoption steps, partner logos
- **Cat listing** (`/koty`) — server-side fetched, filterable by tag and sex
- **Cat profile** (`/koty/[id]`) — full gallery, health tags, sticky adopt CTA, fundraiser widget
- **Adoption flow** — `/jak-adoptowac` explainer → authenticated application form → `/moje-podania` status tracker
- **Success stories** (`/sukcesy`) — filterable grid of adopted cats
- **Support page** (`/wspieraj`) — donation options, fundraiser list, `/podatek` 1% tax redirect
- **Partners page** (`/partnerzy`) — logo grid + event highlights
- **Auth** — `/logowanie` + `/rejestracja` with JWT stored in `localStorage`
- **Admin panel** (`/admin`) — application queue + cat management; `AdminToolbar` component injected into cat pages for quick admin actions
- **Components** — `CatCarousel`, `CatFilterBar`, `CatTags`, `PhotoCarousel`, `RevealOnScroll`, `AnimatedCounter`, `StickyAdoptCTA`, `SuccessStoryCard`, `StepConnector`

---

## Running locally

```bash
# 1. Start Postgres
docker compose up db -d

# 2. Backend
cp .env.example .env          # fill SECRET_KEY; R2 vars optional
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload  # → http://localhost:8000/docs

# 3. Frontend
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8000
pnpm install
pnpm dev                           # → http://localhost:3000
```

Or run everything containerised:

```bash
docker compose up --build
```

---

## What's next

- [ ] **Deployment** — production Docker setup, Caddy reverse proxy, CI/CD pipeline
- [ ] **Email notifications** — transactional emails on application status change and newsletter confirmation (SMTP / Resend)
- [ ] **Pagination** — cursor-based pagination on `/cats` and `/admin/applications`
- [ ] **Search & filtering** — full-text search on cat names/descriptions; filter by breed and age range
- [ ] **Password reset** — forgot-password flow with time-limited tokens
- [ ] **User profile** — `GET /users/me` + editable adopter profile
- [ ] **Scraper integration** — scheduled import from external sources to seed cat data
- [ ] **Tests** — pytest suite for API endpoints; Playwright E2E for critical user flows
- [ ] **Monitoring** — Sentry error tracking; structured JSON logs for log aggregation

---

## Design

Editorial aesthetic inspired by Kinfolk / NYT Magazine — generous whitespace, photography-led layouts, no clipart paw prints. Brand palette: `#2D6A4F` (green) · `#F4E8D1` (warm cream) · `#C1440E` (rust CTA). Light mode only.
