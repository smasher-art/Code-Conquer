# Contributing to Bebo Tech

> **BTES Ambassador Program 2025 · Chitkara University**

Thank you for taking the time to contribute! Please read this document carefully before opening an issue or pull request. Following these guidelines helps maintainers review contributions quickly and keeps the codebase consistent.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Branch Strategy](#branch-strategy)
4. [Commit Message Conventions](#commit-message-conventions)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Review Checklist](#review-checklist)
8. [Reporting Bugs](#reporting-bugs)
9. [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project and everyone participating in it is governed by our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). By contributing, you agree to abide by its terms.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/BTES-2025-Chitkara-University.git
   cd BTES-2025-Chitkara-University
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create a `.env`** file from `.env.example` and fill in the required values.
5. **Create a feature branch** from the appropriate phase branch (see [Branch Strategy](#branch-strategy)).

---

## Branch Strategy

> ⚠️ **No direct commits to `main`.** All changes must arrive via a pull request.

### Protected branches

| Branch | Purpose | Who may merge |
|---|---|---|
| `main` | Stable, reviewed code only | Maintainers (via PR) |
| `phase1-overview` | Phase 1 — Research & Prototype | Team leads (via PR) |
| `pre-final-submission` | Phase 2 — Progress Report | Team leads (via PR) |
| `final-submission` | Phase 3 — Final Release | Team leads (via PR) |

### Feature branch naming

Branch off from the phase branch relevant to your work:

```
<type>/<short-description>
```

| Type prefix | When to use |
|---|---|
| `feat/` | New feature or enhancement |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring, no behaviour change |
| `test/` | Adding or updating tests |
| `chore/` | Build scripts, config, tooling |
| `style/` | Formatting, linting (no logic change) |

**Examples:**

```bash
git checkout phase1-overview
git checkout -b feat/skill-tree-xp-rewards

git checkout pre-final-submission
git checkout -b fix/judge-output-trim

git checkout final-submission
git checkout -b docs/update-architecture
```

### Merging back

```
feat/my-feature  ──►  phase1-overview  ──►  main
```

- Feature → phase branch (PR, at least 1 review)
- Phase branch → `main` (PR, at least 2 reviews, all CI checks green)

---

## Commit Message Conventions

We follow the **Conventional Commits** specification (<https://www.conventionalcommits.org>).

### Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Rules

- Use the **imperative, present tense**: `add`, `fix`, `update` — not `added`, `fixes`, `updated`.
- **Do not capitalise** the first letter of the summary.
- **No period** at the end of the summary line.
- Keep the summary line **≤ 72 characters**.
- Reference issues in the footer: `Closes #42` or `Refs #17`.

### Examples

```
feat(lesson): add XP reward on first-pass submission

fix(judge): trim trailing newlines before output comparison

docs(readme): update installation steps for Node 18

refactor(runner): extract normalizeLang into a shared util

test(api): add supertest suite for /api/auth/login

chore: update eslint to v9 flat config
```

### Breaking changes

Add `!` after the type/scope and include a `BREAKING CHANGE:` footer:

```
feat(api)!: replace /run with /judge for all code execution

BREAKING CHANGE: /run endpoint is removed. Clients must migrate to /judge.
```

---

## Pull Request Process

1. **Ensure your branch is up to date** with the target phase branch before opening a PR:
   ```bash
   git fetch origin
   git rebase origin/phase1-overview  # use the correct phase branch
   ```

2. **Run checks locally** before pushing:
   ```bash
   npm run lint
   node server/testRunner.mjs
   # [TODO: npm test — once the test suite is set up]
   ```

3. **Open the PR** against the correct phase branch (not `main` directly).

4. **Fill in the PR template** (see `.github/PULL_REQUEST_TEMPLATE.md`).
   > [TODO: Create `.github/PULL_REQUEST_TEMPLATE.md`]

5. **Link related issues** in the PR description using `Closes #<issue-number>`.

6. **Request at least one reviewer** from the team.

7. **Do not merge your own PR.** Wait for an approval.

8. **Squash-merge** is preferred to keep `main` history clean. Maintainers will do this on merge.

9. **Delete the feature branch** after merging.

---

## Coding Standards

### General

- Prefer **clarity over cleverness**. Write code that a teammate can understand without the author present.
- Keep functions **small and single-purpose**.
- No commented-out code in PRs unless it includes a `// TODO:` comment with an explanation.

### JavaScript / JSX

- **ES Modules** only (`import`/`export`). No `require()`.
- **Functional components** only. No class components.
- **Custom hooks** for any stateful/side-effectful logic shared between components.
- **No inline styles.** Use Tailwind utility classes or CSS modules.
- File naming:
  - Components: `PascalCase.jsx`
  - Hooks: `camelCase.js` (prefix `use`)
  - Utilities/helpers: `camelCase.js`
  - Constants: `camelCase.js` or `.jsx` if JSX is required

### Tailwind CSS

- Prefer semantic grouping in class lists (layout → spacing → typography → colour → state).
- Extract repeated class combinations into a component, not a custom CSS class.

### Backend (Express)

- All route handlers must be `async` and wrapped in try/catch.
- Return consistent JSON error shapes: `{ error: "<message>" }`.
- Do not log sensitive data (passwords, tokens) to the console.
- Validate all incoming request bodies before processing.

### Imports

- Group imports in order: (1) Node built-ins, (2) third-party packages, (3) local modules.
- Separate groups with a blank line.

### Environment variables

- Never hard-code secrets. Always read from `process.env`.
- Document every new env variable in `.env.example`.

---

## Review Checklist

Use this checklist when reviewing a PR:

### Correctness

- [ ] The change does what the PR description says.
- [ ] Edge cases are handled (empty inputs, null, network errors).
- [ ] No new console errors or warnings introduced.

### Code quality

- [ ] Follows naming conventions (see [Coding Standards](#coding-standards)).
- [ ] No unnecessary duplication — shared logic is extracted.
- [ ] Complex logic has inline comments explaining *why*, not *what*.

### Security

- [ ] No secrets, tokens, or passwords in the diff.
- [ ] User input is validated/sanitised before use.
- [ ] No new dependencies with known vulnerabilities (check with `npm audit`).

### Tests

- [ ] New features include at least one test (unit or integration).
- [ ] Existing tests still pass.

### Documentation

- [ ] `README.md` updated if a user-facing change was made.
- [ ] Relevant `docs/*.md` updated if architecture or API changed.
- [ ] New environment variables added to `.env.example`.

### Branch

- [ ] PR targets the correct phase branch (not `main` directly).
- [ ] Branch is up to date with the target branch (no merge conflicts).
- [ ] Commit messages follow the [Conventional Commits](#commit-message-conventions) format.

---

## Reporting Bugs

1. Search [existing issues](https://github.com/BTES-Hub/BTES-2025-Chitkara-University/issues) before opening a new one.
2. Open a **Bug Report** issue and fill in:
   - Steps to reproduce
   - Expected behaviour
   - Actual behaviour
   - Environment (OS, Node version, browser)
   - Screenshots / console output if applicable

---

## Suggesting Features

1. Open a **Feature Request** issue.
2. Describe the **problem** the feature solves, not just the solution.
3. Include any relevant mockups, references, or prior art.
4. Features discussed in issues must be approved by a maintainer before a PR is opened.

---

> Questions? Reach out to the project maintainers or post in the BTES Ambassador Programme discussion channel.
> [TODO: Add the actual contact / Slack / Discord / Teams channel link here.]
