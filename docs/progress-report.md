# Phase 2 — Progress Report

> **Branch:** `pre-final-submission`
> **Document status:** [TODO: update to "Final" when submitted]
> **Reporting period:** [TODO: add sprint / date range, e.g. "Week 1–6"]
> **Last updated:** [TODO: update date on each revision]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Completed Work](#completed-work)
3. [Milestone Tracker](#milestone-tracker)
4. [Sprint / Burndown Table](#sprint--burndown-table)
5. [Screenshots & Demo Evidence](#screenshots--demo-evidence)
6. [Known Issues](#known-issues)
7. [Team Contributions](#team-contributions)
8. [Next Steps](#next-steps)

---

## Executive Summary

This document summarises the progress of the **Bebo Tech** project (Soulslike Learning Platform) as of the `pre-final-submission` phase of the BTES Ambassador Programme 2025.

**Overall status:** [TODO: Green / Amber / Red]

| Dimension | Status | Notes |
|---|---|---|
| Core features | [TODO] | e.g. "8 of 12 MVP features complete" |
| Prototype stability | [TODO] | e.g. "Stable on Chrome/Firefox desktop" |
| Test coverage | [TODO] | e.g. "Lint passing; unit tests not yet added" |
| Documentation | In progress | Research.md complete; others in draft |
| Phase 3 readiness | [TODO] | e.g. "On track / At risk" |

---

## Completed Work

### Frontend

- [x] React + Vite SPA with full client-side routing (`react-router-dom` v7)
- [x] Home page with project introduction
- [x] Learn page (Realm Map — language selection)
- [x] LearnPath page (skill list per language)
- [x] Lesson page with split-pane layout (theory panel + Monaco editor)
- [x] In-browser JavaScript execution via Web Worker (`jsRunner.worker.js`)
- [x] Judge output display (pass/fail per test case, first failure surfaced)
- [x] Profile page (character sheet — XP, level, completed skills)
- [x] Shrine page scaffold (XP shop — UI complete, backend pending)
- [x] Navbar with auth-aware links
- [x] Scroll-to-top on route change
- [x] `usePlayer` hook (XP state, level, award/spend)
- [x] `useProgress` hook (skill unlock/complete state)
- [x] Progress persistence via `localStorage` (schema v2)
- [ ] Server-side progress sync (`progressSync.js` — scaffolded, not wired)
- [ ] ReactFlow skill-tree DAG view (planned for Phase 3)

### Backend

- [x] Express server with CORS and JSON body parsing
- [x] `/health` endpoint
- [x] `/languages` — returns list of supported execution languages
- [x] `/run` — single-execution endpoint with language normalisation
- [x] `/judge` — multi-test-case endpoint (returns first failure details)
- [x] `/api/auth/signup` — bcrypt + JWT
- [x] `/api/auth/login` — credential validation + token issuance
- [x] `/api/me` — GET/PUT player profile
- [x] `/api/me/progress` — GET/PUT player save state
- [x] JSON file data layer (`server/db.js`) for development
- [ ] Input sanitisation middleware (partially implemented)
- [ ] Rate limiting on `/run` and `/judge`
- [ ] Production database migration

### Documentation

- [x] `docs/soulslike-architecture.md` (internal design notes)
- [x] `docs/research.md` (Phase 1 — complete)
- [ ] `docs/progress-report.md` (this document — in progress)
- [ ] `docs/final-report.md` (Phase 3 — not started)
- [ ] `docs/architecture.md` (formal version — in progress)
- [ ] `docs/roadmap.md`

---

## Milestone Tracker

| # | Milestone | Target date | Actual date | Status |
|---|---|---|---|---|
| M1 | Repository set up; base React + Vite scaffold | [TODO] | [TODO] | ✅ Done |
| M2 | Express server + `/run` endpoint working | [TODO] | [TODO] | ✅ Done |
| M3 | Lesson page functional (editor → judge → XP) | [TODO] | [TODO] | ✅ Done |
| M4 | JWT auth (signup / login) complete | [TODO] | [TODO] | ✅ Done |
| M5 | All core pages routed and rendered | [TODO] | [TODO] | ✅ Done |
| M6 | Progress stored in `localStorage` (schema v2) | [TODO] | [TODO] | ✅ Done |
| M7 | Server-side progress sync | [TODO] | [TODO] | 🔧 In progress |
| M8 | Python lesson content authored (≥ 5 lessons) | [TODO] | — | 🔲 Planned |
| M9 | ReactFlow skill-tree DAG view | [TODO] | — | 🔲 Planned |
| M10 | Full test suite (unit + integration) | [TODO] | — | 🔲 Planned |
| M11 | Production deployment | [TODO] | — | 🔲 Planned |
| M12 | User acceptance testing (UAT) with target users | [TODO] | — | 🔲 Planned |

---

## Sprint / Burndown Table

> [TODO: Replace the example rows below with your actual sprint data. Add or remove rows as needed.]

| Sprint | Sprint Goal | Story points planned | Story points completed | Velocity | Notes |
|---|---|---|---|---|---|
| Sprint 1 | Project scaffold + basic routing | 13 | 13 | 13 | [TODO] |
| Sprint 2 | Lesson page + Web Worker runner | 21 | 18 | 18 | [TODO: note any spillover] |
| Sprint 3 | Auth + backend API | 21 | 21 | 21 | [TODO] |
| Sprint 4 | Progress persistence + profile page | 13 | 11 | 11 | [TODO] |
| Sprint 5 | Server sync + Shrine scaffold | 21 | [TODO] | [TODO] | [TODO] |
| Sprint 6 | Python content + skill tree DAG | 34 | [TODO] | [TODO] | [TODO] |

### Cumulative burndown

> [TODO: Insert a burndown chart image here or link to one. Example placeholder:]
> ![Burndown Chart](../public/screenshots/burndown-sprint6.png)
> *If no chart tool is available, a simple table of "remaining story points per sprint" is acceptable.*

---

## Screenshots & Demo Evidence

> [TODO: Replace each placeholder path with real screenshots. Store images in `public/screenshots/`.]

### Home Page

![Home page screenshot](../public/screenshots/home.png)
*Caption: [TODO: brief description of what the screenshot shows]*

### Learn Page (Realm Map)

![Learn page screenshot](../public/screenshots/learn.png)
*Caption: [TODO]*

### Lesson Page

![Lesson page — code editor and judge output](../public/screenshots/lesson.png)
*Caption: [TODO: show a passing and a failing test case]*

### Profile / Character Sheet

![Profile page screenshot](../public/screenshots/profile.png)
*Caption: [TODO: show XP bar, level, completed skill count]*

### Shrine

![Shrine page screenshot](../public/screenshots/shrine.png)
*Caption: [TODO: note this is a scaffold — describe what is interactive]*

---

## Known Issues

| # | Description | Severity | Component | Status | Workaround |
|---|---|---|---|---|---|
| KI-01 | Progress lost on `localStorage` clear | High | Frontend/persistence | Open — server sync in progress | Export save via Profile page [TODO: implement export] |
| KI-02 | `/judge` returns 500 if code produces infinite loop | High | Backend/runner | Open | [TODO: add subprocess timeout per language] |
| KI-03 | Shrine XP spend not persisted to server | Medium | Backend/API | Open | N/A (feature incomplete) |
| KI-04 | Skill tree shows flat list, not graph | Medium | Frontend/LearnPath | Open | Planned for Phase 3 |
| KI-05 | Python runner: `import` of certain stdlib modules not blocked | Medium | Backend/runner | Under investigation | [TODO: add module allowlist/denylist] |
| KI-06 | Mobile layout broken on Lesson page (Monaco editor) | Low | Frontend/Lesson | Open | Use desktop browser |
| KI-07 | [TODO: add any other issues discovered] | — | — | — | — |

---

## Team Contributions

> [TODO: Fill in each team member's name, role, and key contributions for this phase.]

| Name | Role | Key contributions this phase |
|---|---|---|
| [TODO] | Team Lead / Full-stack | [TODO] |
| [TODO] | Frontend | [TODO] |
| [TODO] | Backend | [TODO] |
| [TODO] | Content / Documentation | [TODO] |
| [TODO] | QA / Testing | [TODO] |

---

## Next Steps

### Must-have before `final-submission`

1. **Server-side progress sync** — wire `progressSync.js` to the backend; resolve conflict strategy (server wins after login).
2. **Python lesson content** — author at least 5 Python lessons covering variables, control flow, functions, lists, and dictionaries.
3. **Rate limiting on runner endpoints** — prevent abuse before any public-facing deployment.
4. **Formal test suite** — add Vitest unit tests for judge logic and XP/levelling utilities; Supertest integration tests for all `/api` routes.
5. **Production DB** — migrate from JSON file to SQLite (or Postgres) before deployment.

### Should-have

- ReactFlow skill-tree DAG visualisation.
- Save export/import from Profile page (localStorage backup).
- Mobile-responsive Lesson page.

### Nice-to-have (Phase 3+ / future)

- Faculty/admin dashboard for student progress tracking.
- Multi-stage "boss fight" projects.
- Analytics telemetry (anonymous usage data).

---

*Previous phase: [docs/research.md](./research.md)*
*Next phase: [docs/final-report.md](./final-report.md)*
