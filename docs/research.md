# Phase 1 — Research & Prototype

> **Branch:** `phase1-overview`
> **Document status:** In progress
> **Last updated:** [TODO: update date on each revision]

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Literature & Market Research](#literature--market-research)
3. [User Personas](#user-personas)
4. [Proposed Solution](#proposed-solution)
5. [Prototype Notes](#prototype-notes)
6. [Risk Register](#risk-register)
7. [References](#references)

---

## Problem Statement

### Context

Learning to code is widely recognised as a high-value skill, yet dropout rates in introductory programming courses remain high. Studies consistently identify two root causes:

1. **Delayed feedback** — students write code in a vacuum, submit assignments days before receiving grades, and have no immediate signal of whether their understanding is correct.
2. **Motivation erosion** — linear curricula offer no agency. Once a student falls behind, there is no engaging mechanism to re-enter the learning loop.

### The Gap

Existing platforms (LeetCode, HackerRank, freeCodeCamp) address either *practice* or *instruction*, but rarely both. They also share a common UX pattern — a list of problems sorted by difficulty — which provides no intrinsic sense of progression or world-building.

### Our Hypothesis

A platform that frames code challenges as a **skill-tree-based role-playing game** — where solving problems earns experience points (XP), unlocks adjacent concept nodes, and builds a visible "character" — will produce higher engagement and lower perceived difficulty for beginner programmers.

### Problem Statement (formal)

> *How might we design a web-based coding education platform that maintains beginner engagement through intrinsic game mechanics — specifically XP, levelling, and skill-tree progression — without sacrificing pedagogical quality or introducing harmful time-pressure mechanics?*

---

## Literature & Market Research

### Academic / Industry Reports

| Source | Key Finding | Relevance |
|---|---|---|
| [TODO: cite paper/report] | Immediate feedback loops improve code comprehension retention by ~30% vs. delayed feedback | Justifies in-browser judge system |
| [TODO: cite paper/report] | Gamification (points, badges, leaderboards) shows short-term engagement gains but not necessarily long-term learning | Informs our *no-leaderboard* design choice |
| [TODO: cite paper/report] | Self-paced, mastery-based learning (vs. time-paced) correlates with better outcomes in programming courses | Justifies skill-tree vs. linear curriculum |
| [TODO: cite paper/report] | "Flow state" in games requires a balance of challenge and skill — too easy causes boredom, too hard causes anxiety | Informs difficulty calibration in lesson design |

### Competitive Analysis

| Platform | Strengths | Weaknesses | Differentiation |
|---|---|---|---|
| LeetCode | Comprehensive problem bank, widely known | No narrative/game layer; intimidating for beginners | Our Soulslike loop rewards attempt-and-fail, not just success |
| freeCodeCamp | Free, structured curriculum | Linear; no agency; no live code execution feedback | Skill tree gives learner-driven exploration |
| Codecademy | Good UX, guided projects | Paywalled; passive (fill-in-the-blank), not open-ended | Our in-browser judge runs *real* code against real test cases |
| Codewars | Gamified (katas, ranks) | No teaching content; jumps to hard problems | We pair theory + challenge in one lesson view |
| CS50x | High quality content, Harvard-backed | Video-heavy; no persistent game-like progression | XP/level gives persistent identity across sessions |

### Key Design Decisions Derived from Research

1. **No timed pressure** — Soulslike games are hard but not time-limited. Lessons do not expire.
2. **Fail-forward framing** — "Defeat" shows the first failing test only; it is not punitive.
3. **Mystery nodes** — Locked skill nodes show "???" to create curiosity without overwhelm.
4. **XP as currency, not just score** — Unspent XP can purchase hints, decoupling "score" from "power".

---

## User Personas

### Persona 1 — The Overwhelmed First-Year

| Attribute | Detail |
|---|---|
| **Name** | Priya Sharma |
| **Age** | 18 |
| **Programme** | B.Tech CSE, Semester 1 |
| **Goal** | Pass her introductory programming course; build confidence |
| **Frustrations** | Feels lost after missing one lecture; LeetCode problems seem impossible; no clear "what to learn next" |
| **Behaviour** | Studies in short bursts (20–30 min); uses mobile and laptop; relies on YouTube explanations |
| **How Bebo Tech helps** | Short, atomic lessons with immediate feedback; skill tree shows exactly what is next; XP reward for every passing submission, even on second attempt |

### Persona 2 — The Self-Taught Side-Hustler

| Attribute | Detail |
|---|---|
| **Name** | Arjun Mehta |
| **Age** | 21 |
| **Programme** | B.Tech IT, Semester 5 (self-learning web dev on the side) |
| **Goal** | Get interview-ready in JavaScript; build side projects |
| **Frustrations** | Knows basics but has gaps; YouTube tutorials don't test understanding; wants structured practice without starting over from scratch |
| **Behaviour** | Skips nodes he already knows; wants to jump to advanced topics quickly; motivated by visible progress |
| **How Bebo Tech helps** | Prerequisite-based unlocking lets him skip forward; XP earned per skill; character sheet shows a "map" of what he knows |

### Persona 3 — The Faculty Observer

| Attribute | Detail |
|---|---|
| **Name** | Dr. Kavita Rao |
| **Age** | 38 |
| **Role** | Assistant Professor, CS Department |
| **Goal** | Supplement classroom teaching with a tool that students actually use; identify struggling students early |
| **Frustrations** | LMS tools are disengaging; no visibility into student practice habits outside assignments |
| **Behaviour** | Checks dashboards weekly; wants exportable data; needs something she can recommend without teaching the tool itself |
| **How Bebo Tech helps** | [TODO: Faculty/admin dashboard is a Phase 2+ feature — add notes here once scoped] |

---

## Proposed Solution

### Solution Overview

**Bebo Tech** is a browser-based, full-stack coding education platform with three interconnected systems:

1. **Skill Tree System** — A DAG (directed acyclic graph) of programming concepts per language. Nodes unlock based on prerequisite completion, player level, or XP spend. Locked nodes are hidden as "???" until a neighbour is completed or a threshold is met.

2. **Learning Loop** — Each skill node contains one or more *lessons* (a theory panel + a code challenge). The learner submits code; the in-browser/server-side judge runs test cases; XP is awarded on pass. On failure, the first failing test is shown with expected vs. actual output.

3. **Progression System** — `xpTotal` drives levelling (monotonic curve); `xpUnspent` is a spendable currency for hints and early unlocks at the Shrine. This creates a virtuous loop: attempt → fail → refine → overcome → earn XP → unlock new content.

### Architecture Summary

See [architecture.md](./architecture.md) for the full system design.

**High-level stack:**

```
Browser
  └── React 19 + Vite 7
        ├── Monaco Editor (code editing)
        ├── ReactFlow (skill tree visualisation)
        └── Web Worker (in-browser JS execution)

Server (Node.js + Express)
  ├── /api  — auth + profile + progress REST API
  ├── /run  — raw code execution endpoint
  └── /judge — multi-test-case judge endpoint
```

### MVP Feature List

| Feature | Status |
|---|---|
| Home page | ✅ Complete |
| Learn page (realm map) | ✅ Complete |
| LearnPath page (skill list) | ✅ Complete |
| Lesson page (theory + editor + judge) | ✅ Complete |
| Profile / character sheet | ✅ Complete |
| Shrine (XP shop) | 🔧 Scaffolded |
| JWT authentication (signup / login) | ✅ Complete |
| Progress persistence (localStorage) | ✅ Complete |
| Progress sync to server | 🔧 In progress |
| Skill tree (ReactFlow DAG view) | 🔲 Planned |
| Multiple language support (Python) | 🔧 In progress |

---

## Prototype Notes

### What was built in Phase 1

- **Frontend:** Full React + Vite SPA with routing across all core pages. Monaco editor integrated with language switching. Web Worker used for safe in-browser JavaScript execution. Tailwind CSS v4 for styling.
- **Backend:** Express server with `/run` (single execution) and `/judge` (multi-test) endpoints. Subprocess-based code runner supporting JavaScript and [TODO: confirm full language list from `server/runner.js`].
- **Auth:** JWT signup/login flow with bcrypt password hashing. JSON file used as development database.
- **Persistence:** Player save (XP, completed/unlocked skills) stored in `localStorage` with a schema-versioned JSON structure.

### Prototype Limitations (known at Phase 1)

- No server-side save sync (all progress is local).
- No skill tree DAG visualisation (list-only view).
- No Python lesson content (runner supports Python, but no lessons authored).
- No real-time test feedback streaming (polling only).
- No admin/faculty view.

### Key Technical Decisions Made

| Decision | Rationale |
|---|---|
| Web Worker for JS execution | Prevents runaway code from blocking the main thread |
| Server-side execution for non-JS | Required for languages that cannot run in the browser |
| `localStorage` as primary save | Fast, zero-latency; server sync is additive |
| JSON file DB for development | Zero-dependency data layer; swap to real DB in production |
| Vite + React (no Next.js) | Simpler SPA model; no SSR required at MVP stage |

---

## Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Code execution sandbox escape (server-side) | Medium | High | Run subprocesses with timeout + resource limits; no shell injection |
| R2 | XP/progress data lost on `localStorage` clear | High | Medium | Implement server-side sync in Phase 2; warn user before clear |
| R3 | Scope creep (boss fights, PvP, AI content) | High | Medium | Strict MVP feature gate; all Phase 2+ features behind a flag |
| R4 | Low student adoption during ambassador window | Medium | High | Conduct usability testing early; iterate on UX before Phase 3 |
| R5 | Dependency security vulnerabilities | Low | Medium | Run `npm audit` before every phase-branch merge to main |
| R6 | JSON file DB race conditions in multi-user test | Medium | Medium | Transition to SQLite or Postgres before load testing |
| R7 | [TODO: add team/timeline-specific risks] | — | — | — |

---

## References

> [TODO: Replace all placeholders with real citations in APA or IEEE format.]

1. [TODO: citation for gamification in CS education]
2. [TODO: citation for immediate feedback in programming learning]
3. [TODO: citation for self-paced mastery learning]
4. [TODO: citation for Soulslike game design patterns]
5. [TODO: ReactFlow documentation link]
6. [TODO: Monaco Editor documentation link]
7. [TODO: any BTES programme brief or specification document]

---

*Next phase: [docs/progress-report.md](./progress-report.md)*
