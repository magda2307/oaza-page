# Claude Agents — Reference & Recommendations

Quick guide to the 71 available agents. Pick the one that best matches your task.

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
```