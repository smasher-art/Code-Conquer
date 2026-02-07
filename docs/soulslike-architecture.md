# Soulslike Learning Platform — Architecture (Feb 2026)

## North Star
A calm, minimal UI with a hard-but-fair Soulslike loop:

- **Learning = combat** (attempt → fail → refine → overcome)
- **Lessons = skirmishes**, **Challenges = duels**, **Projects = boss fights**
- **Concepts = skills** on a **skill tree** with prerequisites and mystery
- **XP (Souls)** earned from victories; **Level** tracks mastery; **Unspent XP** is currency

## Current Codebase Snapshot (what exists today)
- Frontend: Vite + React Router, Monaco editor, JS web worker runner, simple output judge.
- Backend: Express runner with `/languages` and `/run` that compiles/executes code.
- Persistence: `localStorage` for unlocked/completed skills only.

## Target Modular Architecture
Keep a clean split between **UI**, **learning**, and **game systems**.

### Frontend Layers
1. **UI (presentational)**
   - Components: HUD, navbar, panels, buttons, node/skill tiles
   - Pages: Home, Learn (realm map), Path (skill list/tree), Lesson (trial), Profile (character sheet), Shrine (shop)

2. **Application (orchestrators)**
   - Hooks: `usePlayer()`, `useSkillTree(lang)`, `useLesson(id)`
   - Coordinates UI ↔ domain ↔ services

3. **Domain (pure logic, testable)**
   - `progression`: XP/level curve, awarding, spend rules
   - `skills`: unlock rules, prerequisites, visibility/mystery rules
   - `learning`: lesson definitions, judge spec (tests vs output)

4. **Services (I/O)**
   - `save`: local save (localStorage) + optional server sync
   - `apiClient`: auth/user CRUD, runner, future telemetry

### Backend Layers
- `runner`: compilation/execution sandbox (already exists)
- `platform-api`: auth + profile + progress CRUD (basic for now)

## Core Game Systems

### 1) Skill Tree
- Skill nodes represent concepts (e.g., JS Variables, Python Loops).
- Skills have:
  - `id`, `lang`, `title`, `description`
  - `prereqs: string[]`
  - `minLevel?: number`
  - `unlockCostXp?: number` (optional, for Shrine)
  - `visibility`: `hidden` | `mysterious` | `revealed`

**Soulslike Mystery Rules**
- Locked nodes show **"???"** unless:
  - a neighbor/prereq is completed, or
  - player meets `minLevel - 1` threshold, or
  - player purchased a “Glimpse” in the Shrine (future)

### 2) Progression & XP
Use two XP counters:
- `xpTotal`: total earned; drives level
- `xpUnspent`: currency; used for hints/unlocks

**Level curve** (configurable):
- Level is derived from `xpTotal` via a monotonic curve.
- UI shows a calm “XP banner” (HUD) + subtle level-up state.

### 3) Learning Flow
Lesson page is always side-by-side:
- **Left**: theory (dynamic content source later)
- **Right**: editor + run + submit

Outcomes:
- Victory: award XP, mark skill completed, reveal/unlock adjacent skill(s)
- Defeat: show tight feedback (first failing test), keep noise low

### 4) Judge System
Two modes per lesson:
- **Output match** (quick beginner tasks)
- **Test suite** (stdin/expected stdout) with edge cases

Judge output should:
- report *first failing test*, showing expected vs got
- include compile/runtime errors without flooding

### 5) Shrine (Shop/Crafting)
Spend `xpUnspent` on:
- `Hint` (reveals 1 hint)
- `Unlock Sigil` (unlock a skill early if eligible)
- `Cosmetics` (future-proof)

### 6) Authentication (Basic)
MVP auth:
- Email/username + password
- Token-based session

CRUD:
- `GET /me`, `PUT /me`
- `GET /me/progress`, `PUT /me/progress`

## Data Models (MVP)

### PlayerSave (frontend canonical)
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
    "unlocked": { "javascript": ["variables"] },
    "completed": { "javascript": [] }
  },
  "meta": {
    "createdAt": "2026-02-07T00:00:00.000Z",
    "updatedAt": "2026-02-07T00:00:00.000Z"
  }
}
```

### SkillNode (derived from lesson content)
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
  "unlockCostXp": 0
}
```

## API Design (MVP)
Base: `/api`

- `POST /api/auth/signup` → `{ token }`
- `POST /api/auth/login` → `{ token }`
- `GET /api/me` → player profile
- `PUT /api/me` → update profile
- `GET /api/me/progress` → save state
- `PUT /api/me/progress` → replace save state

Runner (existing):
- `GET /languages`
- `POST /run` with `{ language, code, stdin }`

## UI Flow Map
- Home → Learn (Realm Map)
- Learn → Path (Skill Tree/List)
- Path → Lesson (Trial)
- Lesson Victory → XP gain + unlocks + “Continue”
- Navbar/HUD → Profile (Character Sheet)
- Profile → Shrine (Shop)

## Future-Proof Expansion
- Boss fights: multi-stage projects with checkpoints + rubric
- PvE replays: “ghost” runs (hint playback), analytics
- Build “Codex”: searchable concept encyclopedia
- Real skill graph (ReactFlow) per language with branching
- Server-side saves + multi-device sync
