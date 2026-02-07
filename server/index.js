import express from 'express';
import cors from 'cors';
import { runCode, SUPPORTED_LANGUAGES, normalizeLang } from './runner.js';
import buildApiRouter from './api.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/languages', (_req, res) => {
  const list = Object.entries(SUPPORTED_LANGUAGES).map(([k, v]) => ({ key: k, label: v.label, aliases: v.aliases }))
  res.json({ languages: list })
})

// Platform API (auth/profile/progress)
app.use('/api', buildApiRouter())

app.post('/run', async (req, res) => {
  const { language, code, stdin } = req.body || {};
  if (!language || !code) return res.status(400).json({ error: 'Missing language or code' });

  const langKey = normalizeLang(language)
  if (!langKey) return res.status(400).json({ error: `Unsupported language: ${language}` })

  console.log('[run] language=', language, '->', langKey)

  try {
    const result = await runCode(langKey, code, stdin || '');
    console.log('[run] result:', { compileOutput: !!result.compileOutput, stdoutLen: result.stdout?.length || 0, stderrLen: result.stderr?.length || 0, error: result.error })
    res.json(result);
  } catch (e) {
    console.error('[run] uncaught error', e)
    res.status(500).json({ error: String(e) });
  }
});

// Judge endpoint: run multiple tests and return first failure in a quiet format.
app.post('/judge', async (req, res) => {
  const { language, code, tests } = req.body || {}
  if (!language || !code) return res.status(400).json({ error: 'Missing language or code' })
  if (!Array.isArray(tests) || tests.length === 0) return res.status(400).json({ error: 'Missing tests' })

  const langKey = normalizeLang(language)
  if (!langKey) return res.status(400).json({ error: `Unsupported language: ${language}` })

  const results = []
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i] || {}
    const stdin = t.stdin || ''
    const expectedStdout = (t.expectedStdout ?? t.expectedOutput ?? '').toString()
    const r = await runCode(langKey, code, stdin)

    const stdout = (r.stdout || '').replace(/\r\n/g, '\n').trimEnd()
    const expected = expectedStdout.replace(/\r\n/g, '\n').trimEnd()

    const passed = !r.error && (!r.compileOutput) && stdout === expected
    results.push({
      index: i,
      passed,
      stdin,
      expectedStdout: expected,
      stdout,
      compileOutput: r.compileOutput || '',
      stderr: r.stderr || '',
      error: r.error,
    })

    if (!passed) {
      return res.json({ ok: false, failedIndex: i, results })
    }
  }

  return res.json({ ok: true, results })
})

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`Runner server listening on port ${port}`)
  })

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempt < 10) {
      const nextPort = Number(port) + 1
      console.warn(`[server] Port ${port} is in use. Retrying on ${nextPort}...`)
      try { server.close() } catch (_) {}
      startServer(nextPort, attempt + 1)
      return
    }
    console.error('[server] Failed to start:', err)
    process.exit(1)
  })
}

const PORT = Number(process.env.PORT || 5000)
startServer(PORT)
