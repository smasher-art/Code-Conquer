Runner server

This project includes a small Node/Express runner for compiling and running non-JS code from the Monaco editor.

Server files:
- server/index.js — Express API
- server/runner.js — compile/run utility

Available endpoints:
- GET /health — health check
- GET /languages — list supported languages
- POST /run — run code
  - Body: { language: string, code: string, stdin?: string }
  - Response: { compileOutput, stdout, stderr, error }

Run locally:

```bash
npm install
npm run start-server
```

Set `VITE_RUNNER_URL` in your frontend `.env` to point to the runner if the frontend isn't served from the same origin (default: http://localhost:5000).

Notes:
- The runner uses system tools: `python3`, `gcc`, `g++`, `javac`/`java`, `go`.
- Execution and compile timeouts are enforced; tune in `server/runner.js`.
- The runner is not sandboxed — be careful running untrusted code in production.
