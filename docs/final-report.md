# Phase 3 — Final Report

> **Branch:** `final-submission`
> **Document status:** [TODO: update to "Final" when submitted]
> **Submission date:** [TODO: add submission deadline]
> **Last updated:** [TODO: update date on each revision]

---

## Table of Contents

1. [Abstract](#abstract)
2. [Final Solution Overview](#final-solution-overview)
3. [Architecture](#architecture)
4. [Feature Catalogue](#feature-catalogue)
5. [Setup & Installation](#setup--installation)
6. [Running Tests](#running-tests)
7. [Results & Evaluation](#results--evaluation)
8. [Limitations](#limitations)
9. [Future Scope](#future-scope)
10. [Reflections](#reflections)
11. [Demo](#demo)
12. [Team & Acknowledgements](#team--acknowledgements)

---

## Abstract

**Bebo Tech** is a gamified coding education platform built as part of the BTES Ambassador Programme 2025 at Chitkara University. It frames programming practice as a Soulslike role-playing game: learners earn XP by solving code challenges, unlock adjacent skill nodes on a concept graph, and spend unspent XP on hints and early unlocks.

The platform provides:
- In-browser and server-side multi-language code execution with a test-suite judge.
- A skill-tree progression model across JavaScript and Python.
- JWT-based authentication and server-side progress persistence.
- A minimal, distraction-free UI designed to maintain a calm-but-challenging learning atmosphere.

> [TODO: Fill in final quantitative results once UAT and deployment data are available.]

---

## Final Solution Overview

### Problem Solved

> (See [docs/research.md](./research.md) for the full problem statement.)

Existing coding education tools suffer from two failure modes for beginner students: *delayed feedback* and *motivation erosion*. Bebo Tech addresses both through an immediate judge-feedback loop and a game-mechanic progression model that makes mastery feel earned.

### What Was Delivered

| Component | Description | Status |
|---|---|---|
| Skill Tree (JavaScript) | Full concept DAG with XP rewards and unlock rules | [TODO: ✅ / 🔧 / 🔲] |
| Skill Tree (Python) | [TODO] | [TODO] |
| Lesson system | Theory + Monaco editor + judge per skill node | [TODO] |
| XP / Levelling engine | `xpTotal` → level curve; `xpUnspent` as currency | [TODO] |
| Shrine (XP shop) | Hint and early-unlock purchases | [TODO] |
| Auth (signup / login) | JWT + bcrypt, persistent sessions | [TODO] |
| Server-side progress sync | Save/load via REST API, conflict resolution | [TODO] |
| ReactFlow DAG view | Interactive skill-tree graph visualisation | [TODO] |
| Multi-language runner | Execute JS, Python [TODO: others] server-side | [TODO] |
| Test suite | Unit + integration + E2E | [TODO] |

---

## Architecture

For the complete system design, data models, API contracts, and component diagram, see [docs/architecture.md](./architecture.md).

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React 19 SPA (Vite 7)                           │   │
│  │  ├── Pages: Home, Learn, LearnPath, Lesson,      │   │
│  │  │          Profile, Shrine, Login, Signup        │   │
│  │  ├── Hooks: usePlayer, useProgress               │   │
│  │  ├── Components: Navbar, Monaco Editor,          │   │
│  │  │               ReactFlow Skill Tree            │   │
│  │  └── Web Worker: JS in-browser execution         │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────────────────┐
│                  Express Server (Node.js)               │
│  ├── /api/auth      — signup, login (JWT)               │
│  ├── /api/me        — profile CRUD                      │
│  ├── /api/me/progress — save state CRUD                 │
│  ├── /run           — single code execution             │
│  └── /judge         — multi-test-case evaluation        │
│                                                         │
│  ┌────────────────────────────────────────────────┐     │
│  │  Data layer                                    │     │
│  │  Dev: JSON file DB  │  Prod: [TODO: DB choice] │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Feature Catalogue

### Core Game Loop

1. Learner visits `/learn` → picks a language realm.
2. Opens `/learn/:lang` → sees skill tree (list or DAG).
3. Selects an unlocked skill node → lands on `/lesson/:id`.
4. Reads theory (left panel) → writes code in Monaco editor (right panel).
5. Hits **Run** → code executes; output shown.
6. Hits **Submit** → judge runs all test cases.
   - **Pass:** XP awarded, skill marked complete, adjacent nodes may reveal/unlock.
   - **Fail:** First failing test shown (expected vs. actual); no penalty, infinite retries.
7. Visits `/profile` → reviews XP, level, skill map.
8. Visits `/shrine` → spends `xpUnspent` on hints or early unlocks.

### Skill Visibility Rules

| Condition | Node displays as |
|---|---|
| Completed | Full title + ✅ |
| Unlocked (prereqs met) | Full title + available styling |
| Prereq completed but not yet started | Full title + locked icon |
| Prereq NOT completed; player near minLevel | Title shown as "???" |
| Prereq NOT completed; player far from minLevel | Hidden entirely |

### Supported Languages

| Language | In-browser runner | Server runner |
|---|---|---|
| JavaScript | ✅ Web Worker | ✅ Node subprocess |
| Python | ❌ | ✅ Python subprocess |
| [TODO: add others] | — | — |

---

## Setup & Installation

> For full setup instructions see [README.md](../README.md). A quick-start summary is repeated here for evaluators.

### Prerequisites

- Node.js ≥ 18 LTS
- npm ≥ 9
- [TODO: Python ≥ 3.10 if Python runner is used]

### Steps

```bash
# 1. Clone
git clone https://github.com/BTES-Hub/BTES-2025-Chitkara-University.git
cd BTES-2025-Chitkara-University

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env: set PORT and JWT_SECRET

# 4. Start the backend
node server/index.js

# 5. Start the frontend (new terminal)
npm run dev
# Open http://localhost:5173
```

### Environment variables reference

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | No | Backend port (default: 5000) | `5000` |
| `JWT_SECRET` | **Yes** | Secret for signing JWT tokens | `change-me-in-production` |
| `VITE_API_URL` | No | API base URL for the frontend | `http://localhost:5000` |
| [TODO] | — | [TODO: add any additional variables] | — |

---

## Running Tests

> [TODO: Update once the test suite is implemented. Replace all placeholders with real commands and output samples.]

### Lint

```bash
npm run lint
```

### Server smoke tests

```bash
node server/testRunner.mjs
```

Expected output:
```
[TODO: paste sample passing output here]
```

### Unit tests (frontend)

```bash
# [TODO: once Vitest is set up]
npm test
```

### Integration tests (API)

```bash
# [TODO: once Supertest suite is written]
npm run test:api
```

### End-to-end tests

```bash
# [TODO: once Playwright is set up]
npm run test:e2e
```

### Test coverage summary

| Suite | Total tests | Passing | Failing | Coverage |
|---|---|---|---|---|
| Lint | — | ✅ | — | — |
| Judge unit | [TODO] | [TODO] | [TODO] | [TODO] |
| XP/level unit | [TODO] | [TODO] | [TODO] | [TODO] |
| API integration | [TODO] | [TODO] | [TODO] | [TODO] |
| E2E (happy path) | [TODO] | [TODO] | [TODO] | — |

---

## Results & Evaluation

### Functional Testing Results

> [TODO: Fill in after testing is complete.]

| Feature | Test method | Result | Notes |
|---|---|---|---|
| Sign up | Manual + Supertest | [TODO] | [TODO] |
| Log in | Manual + Supertest | [TODO] | [TODO] |
| Lesson submit — pass | Manual + Supertest | [TODO] | [TODO] |
| Lesson submit — fail | Manual + Supertest | [TODO] | [TODO] |
| XP awarded on pass | Unit test | [TODO] | [TODO] |
| Progress persists across page reload | Manual | [TODO] | [TODO] |
| Progress syncs to server | Manual + Supertest | [TODO] | [TODO] |
| Python code execution | Manual | [TODO] | [TODO] |

### User Acceptance Testing (UAT)

> [TODO: Conduct UAT with at least 3 target users (students) and document findings.]

| Participant | Role | Task success rate | Satisfaction (1–5) | Key feedback |
|---|---|---|---|---|
| P1 | [TODO] | [TODO] | [TODO] | [TODO] |
| P2 | [TODO] | [TODO] | [TODO] | [TODO] |
| P3 | [TODO] | [TODO] | [TODO] | [TODO] |

### Performance Observations

> [TODO: Add response time measurements for /judge under load, first contentful paint, etc.]

| Metric | Target | Measured | Status |
|---|---|---|---|
| `/judge` response time (single test) | < 2 s | [TODO] | [TODO] |
| First Contentful Paint (FCP) | < 1.5 s | [TODO] | [TODO] |
| Time to Interactive (TTI) | < 3 s | [TODO] | [TODO] |

---

## Limitations

| # | Limitation | Impact | Notes |
|---|---|---|---|
| L1 | No mobile-responsive Lesson page (Monaco editor constraint) | Medium | Monaco has limited mobile support; consider CodeMirror as alternative |
| L2 | JSON file DB not suitable for concurrent multi-user production load | High | Must migrate to a relational DB before scaling |
| L3 | No lesson content for Python, C, or other languages | Medium | Content authoring is a manual bottleneck |
| L4 | Server-side execution has no hard CPU/memory resource cap per request | High | Process timeout exists but cgroup limits not set |
| L5 | No faculty/admin dashboard | Low for v1 | Planned as Phase 2+ feature |
| L6 | [TODO: add any limitations discovered during testing] | — | — |

---

## Future Scope

| Feature | Priority | Notes |
|---|---|---|
| ReactFlow interactive skill-tree DAG | High | Scaffolded; needs data wiring and layout algorithm |
| Faculty/admin dashboard | High | Student progress visibility; exportable data |
| Multi-stage "boss fight" projects | Medium | Multi-checkpoint rubric-based submissions |
| Real-time test output streaming | Medium | Replace polling with WebSocket or SSE |
| Mobile-responsive editor | Medium | Evaluate CodeMirror 6 as Monaco alternative |
| Save export/import (JSON download) | Medium | Useful as `localStorage` backup |
| AI-generated hint explanations | Low | LLM integration for contextual hints |
| Leaderboard (opt-in) | Low | Requires privacy controls |
| Codex (searchable concept encyclopedia) | Low | Cross-skill reference material |
| Analytics telemetry (anonymous) | Low | Funnel analysis for dropout prediction |

---

## Reflections

> [TODO: Complete this section collaboratively as a team after final submission.]

### What went well

- [TODO: e.g. "The Soulslike framing resonated strongly with test users, who described the retry loop as 'surprisingly motivating'."]

### What we would do differently

- [TODO: e.g. "We would author lesson content in parallel with feature development rather than treating it as a post-feature task."]

### Lessons learned

- [TODO]

---

## Demo

| Resource | Link |
|---|---|
| Live demo | [TODO: add deployment URL] |
| Demo video (walkthrough) | [TODO: add YouTube / Google Drive / Loom link] |
| Presentation slides | [TODO: add Google Slides / PDF link] |

---

## Team & Acknowledgements

| Name | Role | Contact |
|---|---|---|
| [TODO] | Team Lead | [TODO] |
| [TODO] | Frontend Developer | [TODO] |
| [TODO] | Backend Developer | [TODO] |
| [TODO] | Content & Documentation | [TODO] |
| [TODO] | QA & Testing | [TODO] |

**Mentors / Supervisors**

| Name | Organisation | Role |
|---|---|---|
| [TODO] | Chitkara University / BTES | Programme Mentor |

**Acknowledgements**

> [TODO: Thank any individuals, open-source projects, or resources that significantly helped the project.]

---

*Previous phase: [docs/progress-report.md](./progress-report.md)*
*System design reference: [docs/architecture.md](./architecture.md)*
