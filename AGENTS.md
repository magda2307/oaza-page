# Claude Agents — Reference & Recommendations

Quick guide to available agents. Pick the one that best matches your task.

---

## Landing Page Prompt

**Agents used:** `ui-designer` + `frontend-developer` + skills: `copywriting`, `page-cro`, `marketing-psychology`

**Why these:**
- `ui-designer` — visual layout, component design, color/typography decisions
- `frontend-developer` — implementation across the stack, API integration
- `copywriting` — emotionally resonant headlines and cat descriptions that drive adoptions
- `page-cro` — structuring sections so visitors actually click "Adopt" or "Donate"
- `marketing-psychology` — urgency, social proof, emotional hooks for a charity context

---

### Prompt to paste into Claude Code

```
Use the ui-designer and frontend-developer agents together with the copywriting, page-cro, and marketing-psychology skills to build the landing front page for Catcharity — a cat adoption charity.

## Context
- Backend: FastAPI at localhost:8000
- Key endpoints:
  - GET /cats/ → returns list of available cats (fields: id, name, age_years, breed, description, photo_url, is_adopted)
  - POST /applications/ → submit adoption application
- Stack: choose the best fit (Next.js 14 App Router recommended for SEO + server components)
- Style: warm, emotional, trustworthy — this is a charity, not a product store

## Page sections to build (in order)

1. **Hero**
   - Full-width, emotionally powerful headline (use copywriting skill)
   - Subheadline explaining what Catcharity does in one sentence
   - Two CTAs: primary "Meet the cats" (scrolls to grid), secondary "Support us"
   - Background: soft warm image or gradient, not sterile white

2. **Stats bar**
   - 3 numbers: cats rescued, cats adopted, years active (use placeholder numbers, mark as TODO)
   - marketing-psychology: social proof — "You're not alone in caring"

3. **Available cats grid**
   - Fetch from GET /cats/ on server side
   - Card per cat: photo, name, age, breed, short description, "Meet [Name]" button
   - Max 6 on landing, "See all cats" link
   - Empty state if no cats available
   - page-cro: card layout should make the adopt CTA impossible to miss

4. **How adoption works**
   - 3-step visual: Browse → Apply → Welcome home
   - Keep it frictionless — reduce fear of the process

5. **Why adopt / emotional section**
   - Short paragraph + quote from a fictional adopter (mark as placeholder)
   - marketing-psychology: loss aversion + identity ("become someone who saves a life")

6. **Donation / support CTA**
   - Simple, not pushy — "Can't adopt? You can still help"
   - One donate button (link placeholder for now)

7. **Footer**
   - Logo, nav links, social icons (placeholders), contact email

## Requirements
- Fully responsive (mobile-first)
- Accessible: proper heading hierarchy, alt text, focus states
- All copy written using the copywriting skill — warm, human, no corporate language
- page-cro applied to every CTA: placement, contrast, microcopy on buttons
- No placeholder lorem ipsum — write real copy using copywriting + marketing-psychology skills
- Fetch cats server-side (Next.js server component or SSR) so the page is SEO-ready
- Mark any hardcoded data with // TODO comments
```

---

## Backend Implementation Status

FastAPI + asyncpg backend at `app/`. No ORM — raw SQL via query helpers.

### What's implemented

**Auth (`/auth`)**
- `POST /auth/register` — creates user, returns JWT; 409 on duplicate email
- `POST /auth/login` — validates credentials, returns JWT
- JWT via python-jose + passlib/bcrypt; `is_admin` flag in token

**Cats (`/cats`)**
- `GET /cats/` — public; returns non-adopted cats only; supports tag filtering via `tags[]` column
- `GET /cats/{id}` — public
- `POST /cats/` — admin only; all fields optional except `name`
- `PATCH /cats/{id}` — admin only; partial update
- `DELETE /cats/{id}` — admin only
- Fields: `id`, `name`, `age_years`, `breed`, `description`, `photo_url`, `is_adopted`, `tags[]`, `created_at`

**Applications (`/applications`)**
- `POST /applications/` — authenticated; guards: cat must exist, not adopted, no duplicate pending application
- `GET /applications/mine` — authenticated; returns own applications

**Admin (`/admin`)**
- `GET /admin/applications` — admin only; optional `?status_filter=` query param
- `PATCH /admin/applications/{id}` — admin only; approving auto-sets `cat.is_adopted = true`

**Photos (`/photos`)**
- `POST /photos/upload` — admin only; uploads to Cloudflare R2 (S3-compatible via boto3)
- Validates: JPEG/PNG/WebP/GIF, max 10 MB; returns public URL; 503 if R2 not configured

**DB / infra**
- asyncpg connection pool; helpers: `fetch_one`, `fetch_all`, `execute`, `fetch_val`
- 2 Alembic migrations: `001_initial` (users/cats/applications), `002_cat_tags` (adds `tags TEXT[]` to cats)
- Docker Compose runs Postgres on port 5432

### What's NOT yet implemented
- No password reset or email verification
- No pagination on list endpoints
- No cat search/filter by breed or age from API
- No CORS config (needed for the Next.js frontend at a different origin)
- No user profile endpoint (`GET /users/me`)

---

## Built-in Agents

| Agent | Model | Use when |
|-------|-------|----------|
| `general-purpose` | inherit | Default for anything not covered below |
| `Explore` | haiku | Quickly searching files, finding code patterns, answering "where is X?" questions |
| `Plan` | inherit | Designing architecture or implementation strategy before writing code |
| `claude-code-guide` | haiku | Questions about Claude Code CLI, Claude API, or Anthropic SDK |
| `statusline-setup` | sonnet | Configuring the Claude Code status line |

---

## Language Specialists (`voltagent-lang`)

| Agent | Use when |
|-------|----------|
| `python-pro` | Type-safe Python, FastAPI, async patterns, modern tooling |
| `typescript-pro` | Advanced TypeScript types, generics, end-to-end type safety |
| `javascript-pro` | Modern ES2023+ JS, Node.js, browser APIs, async patterns |
| `react-specialist` | React 18+ performance, hooks, state management, complex component architecture |
| `nextjs-developer` | Full-stack Next.js 14+ with App Router, server components, SEO |
| `vue-expert` | Vue 3 Composition API, Nuxt 3, reactivity optimization |
| `angular-architect` | Enterprise Angular 15+, RxJS, micro-frontends, state management |
| `golang-pro` | Concurrent Go, microservices, cloud-native, idiomatic patterns |
| `rust-engineer` | Memory-safe systems programming, zero-cost abstractions, async Rust |
| `java-architect` | Enterprise Java, Spring Boot migrations, microservices architecture |
| `spring-boot-engineer` | Spring Boot 3+, reactive programming, cloud-native Java |
| `kotlin-specialist` | Kotlin coroutines, multiplatform, Android/server-side |
| `swift-expert` | Native iOS/macOS, SwiftUI, async/await, actor model |
| `flutter-expert` | Cross-platform mobile with Flutter 3+, custom UI, state management |
| `cpp-pro` | High-performance C++20/23, template metaprogramming, embedded |
| `csharp-developer` | ASP.NET Core, async C#, Entity Framework, clean architecture |
| `dotnet-core-expert` | .NET Core cloud-native, minimal APIs, cross-platform deployment |
| `dotnet-framework-4.8-expert` | Legacy .NET Framework 4.8 enterprise maintenance |
| `django-developer` | Django 4+ web apps, REST APIs, async views |
| `rails-expert` | Ruby on Rails, Hotwire, real-time features |
| `laravel-specialist` | Laravel 10+, Eloquent ORM, queues, API performance |
| `php-pro` | PHP 8.3+, strict typing, Laravel/Symfony, async/Fiber |
| `elixir-expert` | Fault-tolerant OTP systems, GenServer, Phoenix real-time |
| `sql-pro` | Complex query optimization, schema design, PostgreSQL/MySQL/MSSQL |
| `powershell-5.1-expert` | Legacy Windows automation, AD/DNS/DHCP/GPO with RSAT |
| `powershell-7-expert` | Cross-platform PowerShell 7+, Azure automation, CI/CD pipelines |

---

## Infrastructure & DevOps (`voltagent-infra`)

| Agent | Use when |
|-------|----------|
| `devops-engineer` | CI/CD pipelines, containerization, deployment workflows |
| `deployment-engineer` | Designing or optimizing specific deployment strategies |
| `docker-expert` | Building, optimizing, and securing Docker images and compose setups |
| `kubernetes-specialist` | Designing, deploying, or troubleshooting K8s clusters and workloads |
| `terraform-engineer` | Infrastructure as Code with Terraform, multi-cloud, module architecture |
| `terragrunt-expert` | DRY Terraform configs, multi-environment orchestration with Terragrunt |
| `cloud-architect` | Multi-cloud strategy, migrations, disaster recovery, cost optimization |
| `azure-infra-engineer` | Azure networking, Entra ID, Bicep IaC, PowerShell automation |
| `platform-engineer` | Internal developer platforms, golden paths, self-service infrastructure |
| `sre-engineer` | SLOs/SLIs, error budgets, reliability, chaos engineering |
| `devops-incident-responder` | Active production incidents, outage diagnosis, postmortems |
| `incident-responder` | Active security breaches, evidence preservation, coordinated recovery |
| `network-engineer` | Cloud/hybrid network design, security, performance, troubleshooting |
| `database-administrator` | DB performance tuning, high availability, disaster recovery setup |
| `security-engineer` | Security controls in CI/CD, zero-trust, compliance, vulnerability mgmt |
| `windows-infra-admin` | Windows Server, Active Directory, DNS/DHCP, Group Policy at scale |

---

## Core Development (`voltagent-core-dev`)

| Agent | Use when |
|-------|----------|
| `fullstack-developer` | Features that span DB + API + frontend as one cohesive unit |
| `backend-developer` | Server-side APIs, microservices, scalable backend architecture |
| `frontend-developer` | Multi-framework frontend apps (React/Vue/Angular) with full-stack integration |
| `api-designer` | Designing new REST/GraphQL APIs, OpenAPI specs, versioning strategies |
| `graphql-architect` | GraphQL schema design, federation, query optimization across services |
| `microservices-architect` | Decomposing monoliths, service communication patterns, distributed design |
| `websocket-engineer` | Real-time bidirectional features with WebSockets or Socket.IO at scale |
| `mobile-developer` | Cross-platform React Native / Flutter with >80% code sharing |
| `electron-pro` | Desktop apps with Electron — native OS integration, distribution, security |
| `ui-designer` | Design systems, component libraries, visual interfaces, accessibility |

---

## QA & Security (`voltagent-qa-sec`)

| Agent | Use when |
|-------|----------|
| `code-reviewer` | Thorough code review for quality, patterns, and correctness |
| `architect-reviewer` | Reviewing architectural decisions and design trade-offs |
| `qa-expert` | Test strategy, test coverage, QA process design |
| `test-automator` | Building automated test suites and CI test pipelines |
| `debugger` | Systematic debugging of tricky or hard-to-reproduce issues |
| `error-detective` | Investigating specific errors, stack traces, or failure logs |
| `performance-engineer` | Profiling, bottleneck analysis, latency/throughput optimization |
| `security-auditor` | Security audit of code, dependencies, and configurations |
| `penetration-tester` | Authorized pen testing, vulnerability assessment, exploit research |
| `ad-security-reviewer` | Active Directory security review and hardening |
| `powershell-security-hardening` | Hardening Windows/PowerShell environments |
| `compliance-auditor` | Regulatory compliance checks (SOC2, HIPAA, GDPR, etc.) |
| `chaos-engineer` | Resilience testing, failure injection, fault tolerance validation |
| `accessibility-tester` | WCAG compliance, screen reader testing, a11y audits |

---

## Marketing Skills (`coreyhaines31/marketingskills`)

Installed as skills (invoke with `/skill-name` or "use copywriting" etc.).

| Skill | Use when |
|-------|----------|
| `copywriting` | Writing page text, hero headlines, adoption descriptions, donation copy |
| `page-cro` | Optimizing pages to convert visitors into adopters or donors |
| `marketing-psychology` | Adding urgency, trust signals, emotional triggers to content |
| `content-strategy` | Planning what pages to build and what content to write first |
| `seo-audit` | Auditing existing pages for Google search visibility |
| `ai-seo` | Optimizing for AI search ("cat adoption Warsaw" in ChatGPT/Gemini) |
| `site-architecture` | Planning full site hierarchy and navigation before building |
| `social-content` | Writing Instagram/Facebook posts for the charity |
| `copy-editing` | Polishing all text before it goes live |
| `launch-strategy` | Planning the public launch sequence |

---

## Quick Decision Guide

```
Writing code?
  └─ Specific language/framework → use the matching lang agent
  └─ Full feature (DB+API+UI)    → fullstack-developer
  └─ API design only             → api-designer

Infrastructure?
  └─ IaC / Terraform             → terraform-engineer or terragrunt-expert
  └─ Containers                  → docker-expert or kubernetes-specialist
  └─ CI/CD                       → devops-engineer or deployment-engineer
  └─ Cloud architecture          → cloud-architect

Reviewing / testing?
  └─ Code quality                → code-reviewer
  └─ Security                    → security-auditor
  └─ Performance                 → performance-engineer
  └─ Bugs / errors               → debugger or error-detective

Exploring the codebase?          → Explore
Planning an implementation?      → Plan
Not sure?                        → general-purpose

Marketing / content?
  └─ Writing copy                → copywriting
  └─ Improving conversions       → page-cro
  └─ SEO / Google visibility     → seo-audit or ai-seo
  └─ Planning site structure     → site-architecture
  └─ Social media posts          → social-content
  └─ Emotional hooks / urgency   → marketing-psychology
  └─ Planning what to build      → content-strategy
  └─ Polishing text              → copy-editing
  └─ Going public                → launch-strategy
```