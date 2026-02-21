# Security Policy

> **Project:** Bebo Tech — Soulslike Learning Platform
> **BTES Ambassador Program 2025 · Chitkara University**

---

## Supported Versions

Only the latest commit on the `main` branch is actively maintained and receives security fixes.

| Branch | Supported |
|---|---|
| `main` (latest) | ✅ Yes |
| `final-submission` | ⚠️ Security patches only |
| `pre-final-submission` | ❌ No |
| `phase1-overview` | ❌ No |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in this repository, please report it responsibly:

1. **Email** the project maintainers at:
   `[TODO: add a security contact email address]`
   Use the subject line: `[SECURITY] Bebo Tech — <brief description>`

2. **Include** in your report:
   - A clear description of the vulnerability.
   - Steps to reproduce (proof-of-concept code or screenshots welcome).
   - The potential impact (what could an attacker achieve?).
   - Your suggested fix, if any.

3. **What happens next:**
   - We aim to acknowledge receipt within **48 hours**.
   - We aim to assess the severity and respond with a plan within **7 days**.
   - We will coordinate a fix and disclose publicly after the patch is released.
   - We will credit the reporter (unless they prefer to remain anonymous).

> [TODO: If the project is set up on GitHub, consider enabling GitHub's private security advisory feature under **Settings → Security → Advisories**.]

---

## Known Security Considerations

The following areas have known limitations that are being addressed. Reporters should note these before filing duplicate reports.

| Area | Current state | Planned fix |
|---|---|---|
| Code execution sandbox | Subprocess with timeout only; no cgroup/container isolation | Add resource limits (CPU/memory) before production deployment |
| Rate limiting | Not yet implemented on `/run`, `/judge`, or auth endpoints | `express-rate-limit` middleware — Phase 2 milestone |
| Input validation | Partial coverage on API routes | Full Zod/Joi schema validation — Phase 2 milestone |
| CORS | `*` (allow all origins) in development | Restrict to frontend origin in production |
| JSON file DB | Not safe for concurrent writes | Migrate to Postgres/SQLite before production |

---

## Dependency Hygiene

We aim to maintain a secure dependency tree throughout the project lifecycle.

### Policy

1. Run `npm audit` before every merge to `main`:
   ```bash
   npm audit
   ```
   No **high** or **critical** vulnerabilities should be present in production dependencies at merge time. Development-only vulnerabilities should be triaged and documented.

2. Pin dependency versions in `package.json` (avoid `*` or `latest` ranges).

3. Review the CHANGELOG of any dependency before upgrading a major version.

4. Remove unused dependencies promptly — run:
   ```bash
   npx depcheck
   ```

5. Do not add new dependencies without team discussion. Prefer well-maintained packages with a large adoption base.

### Current audit status

> [TODO: Run `npm audit` and record the result here before each phase-branch PR.]

```
Last audit date: [TODO]
High:     [TODO]
Moderate: [TODO]
Low:      [TODO]
```

---

## Secrets Management

- **Never commit secrets** (API keys, JWT secrets, database passwords) to the repository.
- Use `.env` files for local development. Ensure `.env` is in `.gitignore`.
- Use the `.env.example` file (with blank values) as the canonical list of required variables.
- For production deployments, use the hosting provider's secret/environment variable manager.
- Rotate `JWT_SECRET` if it is ever exposed.

### Pre-commit secret scanning

> [TODO: Enable GitHub secret scanning or install `git-secrets` locally:]
> ```bash
> brew install git-secrets   # macOS
> git secrets --install
> git secrets --register-aws  # example pattern set
> ```

---

## Responsible Disclosure

We follow a **coordinated disclosure** model:

- Reporters are asked to give us a reasonable window (up to 90 days) to patch before public disclosure.
- We will not pursue legal action against researchers who act in good faith and follow this policy.
- We ask that reporters do not exploit the vulnerability beyond what is necessary to demonstrate the issue.

---

*Questions? See [CONTRIBUTING.md](./CONTRIBUTING.md) or contact the team via the BTES programme channel.*
*[TODO: add contact link]*
