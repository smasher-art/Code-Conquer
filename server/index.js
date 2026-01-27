import express from 'express';
import cors from 'cors';
import { runCode, SUPPORTED_LANGUAGES, normalizeLang } from './runner.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/languages', (_req, res) => {
  const list = Object.entries(SUPPORTED_LANGUAGES).map(([k, v]) => ({ key: k, label: v.label, aliases: v.aliases }))
  res.json({ languages: list })
})

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runner server listening on port ${PORT}`));
