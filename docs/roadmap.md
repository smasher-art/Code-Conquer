# Roadmap — Bebo Tech (Soulslike Learning Platform)

> **BTES Ambassador Program 2025 · Chitkara University**
> This roadmap is aligned with the repository's three-phase branch strategy.
> All deliverables must be merged to `main` via a PR from the relevant phase branch.

---

## Table of Contents

1. [Branch & Phase Alignment](#branch--phase-alignment)
2. [Phase 1 — Research & Prototype](#phase-1--research--prototype)
3. [Phase 2 — Pre-Final / Progress Report](#phase-2--pre-final--progress-report)
4. [Phase 3 — Final Submission](#phase-3--final-submission)
5. [Post-Programme Roadmap (Future)](#post-programme-roadmap-future)
6. [Feature Flags & Release Gates](#feature-flags--release-gates)

---

## Branch & Phase Alignment

| Branch | Phase | Goal | Key deliverable |
|---|---|---|---|
| `phase1-overview` | Phase 1 | Research · Prototype | Working prototype + `docs/research.md` |
| `pre-final-submission` | Phase 2 | Progress Report | Stable feature set + `docs/progress-report.md` |
| `final-submission` | Phase 3 | Final Release | Production-ready build + `docs/final-report.md` |
| `main` | Stable | Reviewed, merged code only | — |

---

## Phase 1 — Research & Prototype

> **Branch:** `phase1-overview`
> **Goal:** Validate the core hypothesis ("gamified skill-tree learning loop improves engagement") through research and a functional prototype.

### Milestones

| # | Milestone | Status |
|---|---|---|
| 1.1 | Problem statement & competitive analysis complete | ✅ Done |
| 1.2 | User personas defined (≥ 3) | ✅ Done |
| 1.3 | Tech stack selected and justified | ✅ Done |
| 1.4 | Repository scaffold (Vite + React, Express server) | ✅ Done |
| 1.5 | Core routing: Home, Learn, LearnPath, Lesson, Profile | ✅ Done |
| 1.6 | Monaco editor integrated in Lesson page | ✅ Done |
| 1.7 | Web Worker for in-browser JavaScript execution | ✅ Done |
| 1.8 | `/run` and `/judge` server endpoints functional | ✅ Done |
| 1.9 | XP award + skill completion on passing judge | ✅ Done |
| 1.10 | `localStorage` save (schema v2) | ✅ Done |
| 1.11 | JWT auth (signup + login) | ✅ Done |
| 1.12 | `docs/research.md` authored and reviewed | ✅ Done |
| 1.13 | Phase 1 branch merged to `main` via PR | [TODO] |

### Deliverables

- [x] Functional prototype (all core pages accessible and interactive)
- [x] [`docs/research.md`](./research.md)
- [ ] PR from `phase1-overview` → `main` with at least 2 approvals

---

## Phase 2 — Pre-Final / Progress Report

> **Branch:** `pre-final-submission`
> **Goal:** Stabilise the feature set, wire server-side sync, author Python content, and document progress accurately.

### Milestones

| # | Milestone | Target | Status |
|---|---|---|---|
| 2.1 | Server-side progress sync (PUT /api/me/progress) | [TODO] | 🔧 In progress |
| 2.2 | Conflict resolution strategy for save sync | [TODO] | 🔲 Planned |
| 2.3 | Python lesson content (≥ 5 skills authored) | [TODO] | 🔲 Planned |
| 2.4 | Rate limiting on `/run`, `/judge`, and auth endpoints | [TODO] | 🔲 Planned |
| 2.5 | Input validation middleware on all `/api` routes | [TODO] | 🔲 Planned |
| 2.6 | Vitest unit tests for judge and XP/level logic | [TODO] | 🔲 Planned |
| 2.7 | Supertest integration tests for all API routes | [TODO] | 🔲 Planned |
| 2.8 | Shrine XP spend fully functional (hints + unlocks) | [TODO] | 🔧 In progress |
| 2.9 | Save export/import from Profile page | [TODO] | 🔲 Planned |
| 2.10 | `npm audit` passing (no high/critical vulnerabilities) | [TODO] | 🔲 Planned |
| 2.11 | `docs/progress-report.md` authored and reviewed | [TODO] | 🔧 In progress |
| 2.12 | Phase 2 branch merged to `main` via PR | [TODO] | 🔲 Planned |

### Deliverables

- [ ] All Phase 1 known issues resolved or documented
- [ ] [`docs/progress-report.md`](./progress-report.md)
- [ ] Test suite running in CI [TODO: set up GitHub Actions]
- [ ] PR from `pre-final-submission` → `main` with at least 2 approvals

---

## Phase 3 — Final Submission

> **Branch:** `final-submission`
> **Goal:** Ship a polished, deployable, well-tested, fully documented platform.

### Milestones

| # | Milestone | Target | Status |
|---|---|---|---|
| 3.1 | ReactFlow interactive skill-tree DAG view | [TODO] | 🔲 Planned |
| 3.2 | Skill visibility rules (hidden / mysterious / revealed) wired to DAG | [TODO] | 🔲 Planned |
| 3.3 | Production database migration (SQLite or Postgres) | [TODO] | 🔲 Planned |
| 3.4 | Deployment to hosting provider | [TODO] | 🔲 Planned |
| 3.5 | Mobile-responsive Lesson page (editor fallback) | [TODO] | 🔲 Planned |
| 3.6 | End-to-end tests (Playwright — core happy paths) | [TODO] | 🔲 Planned |
| 3.7 | User Acceptance Testing (UAT) with ≥ 3 students | [TODO] | 🔲 Planned |
| 3.8 | Performance audit (Lighthouse: FCP < 1.5 s, TTI < 3 s) | [TODO] | 🔲 Planned |
| 3.9 | Security audit (`npm audit` + manual review of runner) | [TODO] | 🔲 Planned |
| 3.10 | `docs/final-report.md` complete (results + demo link) | [TODO] | 🔲 Planned |
| 3.11 | `docs/architecture.md` finalised | [TODO] | 🔧 In progress |
| 3.12 | All docs interlinked and spell-checked | [TODO] | 🔲 Planned |
| 3.13 | Demo video recorded and linked in `final-report.md` | [TODO] | 🔲 Planned |
| 3.14 | Phase 3 branch merged to `main` via PR | [TODO] | 🔲 Planned |

### Deliverables

- [ ] Live deployment URL
- [ ] Demo video (walkthrough, ≤ 5 minutes)
- [ ] [`docs/final-report.md`](./final-report.md)
- [ ] Full test suite passing
- [ ] PR from `final-submission` → `main` with at least 2 approvals

---

## Post-Programme Roadmap (Future)

These items are out of scope for the BTES 2025 programme but represent logical next steps.

### Near-term (0–3 months post-submission)

| Feature | Notes |
|---|---|
| Faculty / admin dashboard | Student progress visibility; exportable CSV |
| Multi-language skill trees | C, C++, Java starter trees |
| Real-time test output streaming | WebSocket or SSE — replace polling |
| Anonymous analytics telemetry | Funnel analysis for dropout detection |

### Medium-term (3–6 months)

| Feature | Notes |
|---|---|
| Multi-stage "boss fight" projects | Rubric-based submissions with checkpoints |
| Codex (searchable concept encyclopedia) | Cross-skill reference material |
| Leaderboard (opt-in) | Privacy-controlled; classroom scope only |
| Mobile-native wrapper | React Native or PWA with offline support |

### Long-term (6+ months)

| Feature | Notes |
|---|---|
| AI-assisted hint explanations | LLM integration for contextual, non-spoiler hints |
| Ghost runs / replay hints | Anonymised playback of passing submissions as hints |
| LMS integration | Canvas / Moodle grade passback via LTI |
| Multi-institution support | Multi-tenant architecture |

---

## Feature Flags & Release Gates

To prevent scope creep, any feature beyond the current phase's milestones **must** be gated behind a feature flag and not shipped to `main` until its phase milestone is approved.

| Flag name | Feature | Enable for phase |
|---|---|---|
| `FEATURE_REACTFLOW_TREE` | Skill-tree DAG view | Phase 3 |
| `FEATURE_SERVER_SYNC` | Server-side progress save | Phase 2 |
| `FEATURE_SHRINE` | XP shop (hints + unlocks) | Phase 2 |
| `FEATURE_PYTHON_LESSONS` | Python lesson content | Phase 2 |
| `FEATURE_ANALYTICS` | Anonymous telemetry | Post-programme |
| `FEATURE_BOSS_FIGHTS` | Multi-stage projects | Post-programme |

> [TODO: Implement feature flags via environment variables (e.g. `VITE_FEATURE_REACTFLOW_TREE=true`) and document them in `.env.example`.]

---

*Back to [README.md](../README.md)*
*See also: [docs/research.md](./research.md) · [docs/progress-report.md](./progress-report.md) · [docs/final-report.md](./final-report.md)*
