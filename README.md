# Bebo Tech — Soulslike Learning Platform

> **BTES Ambassador Program 2025 · Chitkara University**
> Repository: `BTES-Hub/BTES-2025-Chitkara-University` · Branch: `main`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Phase](https://img.shields.io/badge/Phase-1%20(Research%20%26%20Prototype)-blue)](.docs/roadmap.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Setup & Installation](#setup--installation)
5. [Usage](#usage)
6. [Testing](#testing)
7. [Branch & Phase Workflow](#branch--phase-workflow)
8. [Documentation](#documentation)
9. [Contributing](#contributing)
10. [License](#license)

---

## Overview

### Objective

**Bebo Tech** is a gamified, Soulslike-inspired coding education platform. It borrows the *attempt → fail → refine → overcome* loop from action-RPG games and applies it to learning programming. Completing lessons earns XP (Souls), which drives character levelling and unlocks adjacent skill-tree nodes — making the learning path feel earned, not prescribed.

### Scope

| In Scope | Out of Scope (v1) |
|---|---|
| JavaScript & Python skill trees | Mobile-native apps |
| In-browser code execution (sandboxed) | Real-time multiplayer |
| XP/levelling + skill unlocks | AI-generated lesson content |
| JWT-based authentication | Payment / monetisation |
| Progress persistence (local + server) | LMS integrations |

### Target Users

- **Primary:** CS/IT undergraduate students (Semester 1–4) looking for structured, engaging practice beyond classroom assignments.
- **Secondary:** Self-taught developers who want a structured skill path with immediate feedback loops.
- **Tertiary:** Educators/mentors seeking a lightweight platform to assign and track coding challenges.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19.x |
| Build tool | Vite | 7.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| Code editor | Monaco Editor | 4.7.x |
| Skill-tree visualisation | ReactFlow | 11.x |
| Backend runtime | Node.js / Express | 4.18.x |
| Authentication | JSON Web Token (JWT) + bcryptjs | — |
| Code execution sandbox | Subprocess runner (server-side) | — |
| Persistence | `localStorage` (frontend) + JSON DB (dev) | — |

> [TODO: Confirm production database — SQLite / PostgreSQL / MongoDB]

---

## Folder Structure

```
BTES-2025-Chitkara-University/
├── public/                    # Static assets
├── src/
│   ├── components/            # Shared UI components (Navbar, ScrollToTop…)
│   ├── hooks/                 # Custom React hooks (usePlayer, useProgress)
│   ├── pages/                 # Route-level page components
│   ├── services/              # API client, auth service, progress sync
│   ├── utils/                 # Pure helpers (judge, lesson defs, XP logic)
│   │   └── constants/         # Static data (skill trees, nav config)
│   └── workers/               # Web Workers (JS sandboxed runner)
├── server/
│   ├── index.js               # Express entry point
│   ├── runner.js              # Code execution sandbox
│   ├── api.js                 # Platform REST API (auth + progress)
│   ├── auth.js                # JWT helpers
│   ├── db.js                  # JSON file-based data layer (dev)
│   └── data/                  # Seed/fixture data
├── docs/
│   ├── research.md            # Phase 1 — problem statement & prototype notes
│   ├── progress-report.md     # Phase 2 — milestones & burndown
│   ├── final-report.md        # Phase 3 — final solution & results
│   ├── architecture.md        # System design & component overview
│   └── roadmap.md             # Phase-wise roadmap
├── tests/                     # [TODO: add unit & integration tests]
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```

---

## Setup & Installation

### Prerequisites

| Requirement | Minimum version |
|---|---|
| Node.js | 18.x LTS |
| npm | 9.x |
| Git | 2.x |

> [TODO: If a Python runner backend is added, document `python ≥ 3.10` and `pip` here.]

### 1 — Clone the repository

```bash
git clone https://github.com/BTES-Hub/BTES-2025-Chitkara-University.git
cd BTES-2025-Chitkara-University
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Environment variables

Create a `.env` file in the project root (never commit this file):

```env
# Server
PORT=5000
JWT_SECRET=[TODO: replace with a long random secret]

# Vite dev proxy target
VITE_API_URL=http://localhost:5000
```

See `.env.example` for all available variables.

> [TODO: Create `.env.example` with all keys but no values, and add `.env` to `.gitignore`.]

### 4 — Run in development

Open **two terminals**:

**Terminal 1 — Backend**

```bash
node server/index.js
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend**

```bash
npm run dev
# Vite dev server on http://localhost:5173
```

### 5 — Production build

```bash
npm run build        # Compiles frontend to /dist
npm run preview      # Preview the production build locally
```

---

## Usage

| URL | Description |
|---|---|
| `/` | Home / landing page |
| `/learn` | Realm Map — choose a language skill tree |
| `/learn/:lang` | Skill Tree / Path view for a language |
| `/lesson/:id` | Lesson trial — theory + code editor + judge |
| `/profile` | Character sheet — XP, level, completed skills |
| `/shrine` | Shop — spend unspent XP on hints & unlocks |
| `/login` | Authentication |
| `/signup` | Registration |

**Default guest flow:** Navigate to `/learn` → pick JavaScript → select a skill node → attempt the lesson → submit code → receive XP on passing all test cases.

---

## Testing

> [TODO: Add a test framework (e.g., Vitest + React Testing Library for frontend, Jest/Supertest for backend) and populate the `/tests` directory.]

### Run linting

```bash
npm run lint
```

### Run the server test runner

```bash
node server/testRunner.mjs
```

### Planned test coverage

| Area | Tool | Status |
|---|---|---|
| Frontend unit tests | Vitest + RTL | 🔲 Planned |
| API integration tests | Supertest | 🔲 Planned |
| Judge logic unit tests | Vitest | 🔲 Planned |
| E2E (happy path flows) | Playwright | 🔲 Planned |

---

## Branch & Phase Workflow

> **No direct commits to `main`.** All work must go through a pull request from the appropriate phase branch.

| Branch | Phase | Deliverables | Docs |
|---|---|---|---|
| `phase1-overview` | Phase 1 — Research & Prototype | Problem statement, literature review, user personas, working prototype | [docs/research.md](./docs/research.md) |
| `pre-final-submission` | Phase 2 — Progress Report | Completed milestones, burndown table, known issues | [docs/progress-report.md](./docs/progress-report.md) |
| `final-submission` | Phase 3 — Final Release | Full feature set, architecture docs, test results, demo | [docs/final-report.md](./docs/final-report.md) |

### Workflow summary

```
feature/my-feature  ──►  phase1-overview  ──►  main  (via PR + review)
                    ──►  pre-final-submission  ──►  main
                    ──►  final-submission  ──►  main
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full branch naming rules, commit conventions, and PR checklist.

---

## Documentation

| Document | Description |
|---|---|
| [docs/research.md](./docs/research.md) | Phase 1: problem statement, research, personas, prototype |
| [docs/progress-report.md](./docs/progress-report.md) | Phase 2: milestones, burndown, known issues |
| [docs/final-report.md](./docs/final-report.md) | Phase 3: final solution, results, demo link |
| [docs/architecture.md](./docs/architecture.md) | System design, data flow, API contracts |
| [docs/roadmap.md](./docs/roadmap.md) | Phase-wise feature roadmap |

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening any issue or pull request.
All contributors are expected to follow the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
To report a security vulnerability, see [SECURITY.md](./SECURITY.md).

---

## License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for details.

> [TODO: Confirm licence with the BTES programme coordinators before final submission.]
