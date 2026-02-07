import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import child_process from 'child_process';

const TMP_PREFIX = 'bebo-run-';

function runProcess(cmd, args, { cwd, stdin = '', timeout = 5000, maxBuffer = 200 * 1024 } = {}) {
  return new Promise((resolve) => {
    const child = child_process.spawn(cmd, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let killed = false

    const timer = setTimeout(() => {
      killed = true
      try { child.kill('SIGKILL') } catch (_) {}
    }, timeout)

    child.stdout.on('data', (d) => {
      stdout += d.toString('utf8')
      if (stdout.length > maxBuffer) {
        killed = true
        try { child.kill('SIGKILL') } catch (_) {}
      }
    })

    child.stderr.on('data', (d) => {
      stderr += d.toString('utf8')
      if (stderr.length > maxBuffer) {
        killed = true
        try { child.kill('SIGKILL') } catch (_) {}
      }
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      resolve({ code: 1, stdout, stderr: stderr || String(err) })
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code: killed ? 124 : (code ?? 1), stdout, stderr })
    })

    try {
      if (stdin) child.stdin.write(String(stdin))
      child.stdin.end()
    } catch (_) {
      // ignore
    }
  })
}

// Supported language keys and aliases
export const SUPPORTED_LANGUAGES = {
  python: { label: 'Python', aliases: ['py'] },
  c: { label: 'C', aliases: [] },
  cpp: { label: 'C++', aliases: ['c++'] },
  java: { label: 'Java', aliases: [] },
  go: { label: 'Go', aliases: ['golang'] },
}

function extensionForLang(lang) {
  const key = normalizeLang(lang)
  switch (key) {
    case 'python': return 'py';
    case 'c': return 'c';
    case 'cpp': return 'cpp';
    case 'java': return 'java';
    case 'go': return 'go';
    default: return null;
  }
}

export function normalizeLang(lang) {
  if (!lang) return null
  const l = String(lang).toLowerCase()
  if (SUPPORTED_LANGUAGES[l]) return l
  // check aliases
  for (const k of Object.keys(SUPPORTED_LANGUAGES)) {
    if (SUPPORTED_LANGUAGES[k].aliases.includes(l)) return k
  }
  return null
}

export async function runCode(language, code, stdin = '') {
  console.log('[runner] runCode language=', language)
  const ext = extensionForLang(language);
  if (!ext) return { error: `Unsupported language: ${language}` };

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), TMP_PREFIX));
  try {
    let sourceName = (language === 'java') ? 'Main.java' : `main.${ext}`;
    const sourcePath = path.join(tmpDir, sourceName);
    await fs.writeFile(sourcePath, code, 'utf8');

    let compileOutput = '';
    let run = null;

    if (language === 'python') {
      run = () => runProcess('python3', [sourcePath], { stdin, timeout: 5000 });
    } else if (language === 'c') {
      const outExe = path.join(tmpDir, 'main');
      const cRes = await runProcess('gcc', [sourcePath, '-O2', '-std=c11', '-o', outExe], { timeout: 10000 })
      compileOutput = (cRes.stdout || '') + (cRes.stderr || '')
      if (cRes.code !== 0) {
        return { compileOutput, stdout: '', stderr: '', error: 'Compilation failed' };
      }
      run = () => runProcess(outExe, [], { stdin, timeout: 5000 })
    } else if (language === 'cpp') {
      const outExe = path.join(tmpDir, 'main');
      const cRes = await runProcess('g++', [sourcePath, '-O2', '-std=c++17', '-o', outExe], { timeout: 10000 })
      compileOutput = (cRes.stdout || '') + (cRes.stderr || '')
      if (cRes.code !== 0) {
        return { compileOutput, stdout: '', stderr: '', error: 'Compilation failed' };
      }
      run = () => runProcess(outExe, [], { stdin, timeout: 5000 })
    } else if (language === 'java') {
      const cRes = await runProcess('javac', [sourceName], { timeout: 15000, cwd: tmpDir })
      compileOutput = (cRes.stdout || '') + (cRes.stderr || '')
      if (cRes.code !== 0) {
        return { compileOutput, stdout: '', stderr: '', error: 'Compilation failed' };
      }
      run = () => runProcess('java', ['-cp', tmpDir, 'Main'], { stdin, timeout: 5000 })
    } else if (language === 'go') {
      run = () => runProcess('go', ['run', sourcePath], { stdin, timeout: 8000 })
    }

    if (!run) return { compileOutput, stdout: '', stderr: '', error: 'Runtime not available' }

    const rRes = await run()
    const error = rRes.code === 0 ? null : (rRes.code === 124 ? 'Execution timed out' : 'Execution failed')
    return { compileOutput, stdout: rRes.stdout || '', stderr: rRes.stderr || '', error };
  } finally {
    try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}
