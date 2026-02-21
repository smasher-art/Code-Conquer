# Architecture — Bebo Tech (Soulslike Learning Platform)

> **Related branch:** all phases
> **Last updated:** [TODO: update date on each revision]
> **See also:** [docs/research.md](./research.md) · [docs/final-report.md](./final-report.md)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Models](#data-models)
5. [API Contracts](#api-contracts)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Component Overview](#component-overview)
8. [Security Considerations](#security-considerations)
9. [Deployment Architecture](#deployment-architecture)
10. [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)

---

## System Overview

Bebo Tech is a **single-page application (SPA)** backed by a **Node.js/Express REST API**. The two tiers communicate over HTTP. Code execution happens in two places:

- **In-browser (JavaScript only):** A dedicated Web Worker evaluates JS submissions without blocking the UI thread.
- **Server-side (all languages):** A subprocess-based runner on the Express server compiles and runs code in an isolated child process with a configurable timeout.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Vite 7 build output (static HTML / JS / CSS)       │   │
│  │                                                     │   │
│  │  React 19 SPA                                       │   │
│  │  ├── react-router-dom v7  (client-side routing)     │   │
│  │  ├── @monaco-editor/react (code editor)             │   │
│  │  ├── reactflow v11        (skill tree DAG)          │   │
│  │  ├── tailwindcss v4       (styling)                 │   │
│  │  └── jsRunner.worker.js   (Web Worker — JS exec)   │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP REST (JSON)
                          │ Authorization: Bearer <jwt>
┌─────────────────────────▼───────────────────────────────────┐
│  Express 4 Server (Node.js ≥ 18)                           │
│                                                             │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────────┐    │
│  │  /api router │  │  /run      │  │  /judge          │    │
│  │  auth + CRUD │  │  (exec 1)  │  │  (multi-test)    │    │
│  └──────┬───────┘  └─────┬──────┘  └────────┬─────────┘   │
│         │                │                   │              │
│  ┌──────▼───────────────────────────────────▼─────────┐    │
│  │  runner.js — subprocess code execution              │    │
│  │  (node child_process / spawn, configurable timeout) │    │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  db.js — data layer                                 │   │
│  │  Dev: JSON file  │  Prod: [TODO: Postgres / SQLite] │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

The frontend is organised into four conceptual layers:

### 1. Presentation Layer — UI Components

Located in `src/components/` and `src/pages/`.

| Component / Page | File | Responsibility |
|---|---|---|
| `Navbar` | `components/navbar/Navbar.jsx` | Top navigation; auth-aware links; XP/level HUD |
| `ScrollToTop` | `components/ScrollToTop.jsx` | Reset scroll position on route change |
| `Home` | `pages/Home.jsx` | Landing page; entry call-to-action |
| `Learn` | `pages/Learn.jsx` | Realm Map — language selection cards |
| `LearnPath` | `pages/LearnPath.jsx` | Skill list/tree for a chosen language |
| `Lesson` | `pages/Lesson.jsx` | Split-pane: theory + Monaco editor + judge output |
| `Profile` | `pages/Profile.jsx` | Character sheet: XP, level, skill completion map |
| `Shrine` | `pages/Shrine.jsx` | XP shop: hints, early unlocks |
| `Login` / `Signup` | `pages/Login.jsx` / `Signup.jsx` | Authentication forms |

### 2. Application Layer — Hooks

Located in `src/hooks/`.

| Hook | File | Responsibility |
|---|---|---|
| `usePlayer` | `hooks/usePlayer.js` | XP state, level derivation, award/spend actions |
| `useProgress` | `hooks/useProgress.js` | Skill unlock/complete state; reads/writes save |

### 3. Domain Layer — Pure Logic

Located in `src/utils/`.

| Module | File | Responsibility |
|---|---|---|
| `judge` | `utils/judge.js` | Compares actual vs. expected output; formats failure messages |
| `progress` | `utils/progress.js` | Unlock rules, prerequisite checking, save schema migration |
| `lessons` | `utils/lessons.js` | Lesson definitions (content + test cases) |
| `languages` | `utils/languages.js` | Language metadata, key normalisation |
| `learnTrees` | `utils/constants/learnTrees.jsx` | Static skill-tree data (placeholder — see ADR-02) |
| `navbar` | `utils/constants/navbar.jsx` | Navigation link definitions |

### 4. Services Layer — I/O

Located in `src/services/`.

| Service | File | Responsibility |
|---|---|---|
| `apiClient` | `services/apiClient.js` | Axios/fetch wrapper; attaches JWT; handles 401 |
| `auth` | `services/auth.js` | Login, signup, token storage (memory + localStorage) |
| `progressSync` | `services/progressSync.js` | Debounced server sync of player save state |

### 5. Web Worker

| File | Responsibility |
|---|---|
| `workers/jsRunner.worker.js` | Runs untrusted JavaScript in an isolated Worker thread; returns stdout/stderr to the Lesson page |

---

## Backend Architecture

The server entrypoint is `server/index.js`. Modules are:

| Module | File | Responsibility |
|---|---|---|
| Server entry | `server/index.js` | Express app setup, middleware, route mounting |
| API router | `server/api.js` | Builds and exports the `/api` router subtree |
| Auth helpers | `server/auth.js` | JWT sign/verify, bcrypt wrappers |
| Data layer | `server/db.js` | Read/write user and progress records |
| Code runner | `server/runner.js` | Language normalisation, subprocess execution, timeout |

### Middleware stack (order matters)

```
Request
  → CORS
  → express.json({ limit: '200kb' })
  → /health         (no auth)
  → /languages      (no auth)
  → /api/*          (auth middleware on protected routes)
  → /run            (no auth — rate-limit TODO)
  → /judge          (no auth — rate-limit TODO)
  → 404 handler
```

---

## Data Models

### PlayerSave (frontend-canonical, stored in `localStorage` and synced to server)

```json
{
  "version": 2,
  "player": {
    "id": "guest",
    "displayName": "Tarnished",
    "xpTotal": 0,
    "xpUnspent": 0
  },
  "skills": {
    "unlocked": {
      "javascript": ["variables"]
    },
    "completed": {
      "javascript": []
    }
  },
  "meta": {
    "createdAt": "2026-02-07T00:00:00.000Z",
    "updatedAt": "2026-02-07T00:00:00.000Z"
  }
}
```

### SkillNode

```json
{
  "id": "javascript:variables",
  "lang": "javascript",
  "skill": "variables",
  "title": "Variables & Data Types",
  "difficulty": 1,
  "xpReward": 50,
  "prereqs": [],
  "minLevel": 1,
  "unlockCostXp": 0,
  "visibility": "revealed"
}
```

`visibility` enum: `"hidden"` | `"mysterious"` | `"revealed"`

### Lesson

```json
{
  "id": "javascript:variables:01",
  "skillId": "javascript:variables",
  "title": "Declare your first variable",
  "theory": "<markdown or HTML string>",
  "starterCode": "// Write your solution here\n",
  "tests": [
    { "stdin": "", "expectedStdout": "hello world\n" }
  ],
  "hints": ["TODO: hint text"]
}
```

### User (server-side)

```json
{
  "id": "<uuid>",
  "username": "priya",
  "email": "priya@example.com",
  "passwordHash": "<bcrypt>",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### RunResult (from `/run` and `/judge`)

```json
{
  "stdout": "hello world\n",
  "stderr": "",
  "compileOutput": "",
  "error": null,
  "exitCode": 0,
  "timedOut": false
}
```

---

## API Contracts

Base URL: `http://localhost:5000` (dev) | `[TODO: production URL]`

### Authentication

| Method | Path | Auth? | Request body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | No | `{ username, email, password }` | `{ token: "<jwt>" }` |
| `POST` | `/api/auth/login` | No | `{ email, password }` | `{ token: "<jwt>" }` |

### Player Profile

| Method | Path | Auth? | Request body | Response |
|---|---|---|---|---|
| `GET` | `/api/me` | ✅ Bearer | — | `{ id, username, email }` |
| `PUT` | `/api/me` | ✅ Bearer | `{ displayName }` | `{ id, username, displayName }` |

### Progress

| Method | Path | Auth? | Request body | Response |
|---|---|---|---|---|
| `GET` | `/api/me/progress` | ✅ Bearer | — | `PlayerSave` JSON |
| `PUT` | `/api/me/progress` | ✅ Bearer | `PlayerSave` JSON | `{ ok: true }` |

### Code Execution

| Method | Path | Auth? | Request body | Response |
|---|---|---|---|---|
| `GET` | `/languages` | No | — | `{ languages: [{ key, label, aliases }] }` |
| `POST` | `/run` | No | `{ language, code, stdin? }` | `RunResult` |
| `POST` | `/judge` | No | `{ language, code, tests: [{ stdin, expectedStdout }] }` | `{ passed: bool, results: [...], firstFailure: {...} \| null }` |

### Utility

| Method | Path | Response |
|---|---|---|
| `GET` | `/health` | `{ ok: true }` |

### Error format

All errors return:

```json
{ "error": "<human-readable message>" }
```

With the appropriate HTTP status code (400 for client errors, 401/403 for auth, 500 for server errors).

---

## Data Flow Diagrams

### Lesson Submit Flow

```
User hits "Submit" in Lesson page
        │
        ▼
Lesson.jsx collects { language, code }
        │
        ├─── language === "javascript" ?
        │         │ YES
        │         ▼
        │    jsRunner.worker.js
        │    runs each test case in Worker
        │         │
        │         ▼
        │    Worker posts { results } back
        │
        └─── NO (Python, etc.)
                  │
                  ▼
             POST /judge  { language, code, tests }
                  │
                  ▼
             server/runner.js spawns subprocess
             with timeout; collects stdout/stderr
                  │
                  ▼
             Returns { passed, results, firstFailure }
                  │
        ◄─────────┘
        │
        ▼
judge.js compares actual vs expected
        │
        ├─── All pass?  → award XP → mark skill complete
        │                → reveal/unlock adjacent nodes
        │                → show "Victory" state
        │
        └─── Any fail?  → show first failing test
                        → no XP change
                        → show "Defeat" state (retry available)
```

### Authentication Flow

```
User fills Signup / Login form
        │
        ▼
services/auth.js calls POST /api/auth/signup (or /login)
        │
        ▼
server/api.js validates body → bcrypt verify (login) / hash (signup)
        │
        ▼
JWT signed with JWT_SECRET → returned as { token }
        │
        ▼
Frontend stores token in memory + localStorage
        │
        ▼
Subsequent requests attach: Authorization: Bearer <token>
```

### Progress Sync Flow

```
Lesson completed / XP changed
        │
        ▼
usePlayer / useProgress updates in-memory state
        │
        ▼
localStorage.setItem("playerSave", JSON.stringify(save))
        │
        ▼ (debounced, if user is logged in)
services/progressSync.js → PUT /api/me/progress
        │
        ▼
server persists to DB
```

---

## Component Overview

```
App.jsx
├── <ScrollToTop />
├── <Navbar />          ← reads usePlayer for HUD data
└── <Routes>
    ├── /               → <Home />
    ├── /learn          → <Learn />
    ├── /learn/:lang    → <LearnPath />   ← reads skill tree + useProgress
    ├── /lesson/:id     → <Lesson />      ← usePlayer, useProgress, apiClient
    ├── /profile        → <Profile />     ← usePlayer, useProgress
    ├── /shrine         → <Shrine />      ← usePlayer (xpUnspent)
    ├── /login          → <Login />       ← services/auth
    └── /signup         → <Signup />      ← services/auth
```

---

## Security Considerations

| Area | Current state | Recommendation |
|---|---|---|
| Code execution | Subprocess with timeout | Add cgroup CPU/memory limits; container sandboxing for production |
| JWT secret | Read from `process.env.JWT_SECRET` | Use a 256-bit random secret; rotate periodically |
| Password storage | bcryptjs (cost factor 10) | Adequate; consider argon2 for new implementations |
| Input validation | Partial | Add Zod or Joi schema validation on all API endpoints |
| Rate limiting | ❌ Not implemented | Add `express-rate-limit` on `/run`, `/judge`, and auth endpoints |
| CORS | Allow-all (`cors()`) | Restrict origin whitelist in production |
| Secrets in repo | None detected | Run `git-secrets` or GitHub secret scanning on all PRs |

See [SECURITY.md](../SECURITY.md) for the vulnerability reporting process.

---

## Deployment Architecture

> [TODO: Complete once a deployment target is chosen.]

### Option A — Single server (simple)

```
[Nginx] → [Express server (port 5000, serves /api + static /dist)]
         → [DB: SQLite file or Postgres]
```

### Option B — Separated frontend + backend

```
[CDN / Vercel / Netlify] → serves React SPA (static)
                         → API calls proxied to:
[Railway / Render / VPS] → Express server
                         → [Postgres DB]
```

| Variable | Development | Production |
|---|---|---|
| `PORT` | 5000 | [TODO] |
| `JWT_SECRET` | `.env` local | Secret manager / env var |
| DB | `server/data/db.json` | [TODO: Postgres / SQLite] |
| CORS origin | `*` | Frontend domain only |

---

## Architecture Decision Records (ADRs)

### ADR-01: Vite SPA over Next.js

| | |
|---|---|
| **Decision** | Use Vite + React (SPA) rather than Next.js (SSR/SSG) |
| **Context** | The platform is fully interactive; no meaningful SEO requirement at MVP stage |
| **Rationale** | Simpler mental model; faster dev iteration; no need for server-side rendering complexity |
| **Trade-offs** | No SSR means slower FCP on cold load; no built-in file-based routing |
| **Status** | Accepted |

### ADR-02: Static lesson data (no CMS)

| | |
|---|---|
| **Decision** | Lesson content defined as static JS objects in `src/utils/lessons.js` |
| **Context** | Authoring a CMS integration would be a significant scope addition for v1 |
| **Rationale** | Keeps the content layer simple and version-controlled; easy to iterate |
| **Trade-offs** | Content changes require a code deploy; no non-developer authoring workflow |
| **Status** | Accepted for v1; revisit in Phase 3+ |

### ADR-03: JSON file DB for development

| | |
|---|---|
| **Decision** | Use a JSON file as the data layer during development |
| **Context** | Zero external dependencies needed for local setup; reduces contributor friction |
| **Rationale** | Fast to stand up; sufficient for single-developer / small-team testing |
| **Trade-offs** | No concurrent write safety; not suitable for production |
| **Status** | Accepted for dev; **must migrate before production deployment** |

### ADR-04: Web Worker for in-browser JS execution

| | |
|---|---|
| **Decision** | Run learner JavaScript submissions in a Web Worker thread |
| **Context** | Untrusted code running on the main thread can freeze the UI or access DOM |
| **Rationale** | Worker thread is isolated from the main thread; can be terminated on timeout |
| **Trade-offs** | Worker cannot access DOM or `window`; limits what JavaScript can be taught in-browser |
| **Status** | Accepted |

---

*Back to [README.md](../README.md)*
