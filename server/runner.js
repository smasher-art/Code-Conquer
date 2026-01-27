import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import child_process from 'child_process';

const exec = promisify(child_process.exec);

const TMP_PREFIX = 'bebo-run-';

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
    let runCmd = null;

    if (language === 'python') {
      runCmd = `python3 ${sourcePath}`;
    } else if (language === 'c') {
      const outExe = path.join(tmpDir, 'main');
      try {
        const { stdout, stderr } = await exec(`gcc ${sourcePath} -O2 -std=c11 -o ${outExe}`, { timeout: 10000 });
        compileOutput = (stdout || '') + (stderr || '');
      } catch (e) {
        compileOutput = (e.stdout || '') + (e.stderr || '') + '\n' + (e.message || String(e));
        return { compileOutput, stdout: '', stderr: '', error: e.message || 'Compilation failed' };
      }
      runCmd = outExe;
    } else if (language === 'cpp') {
      const outExe = path.join(tmpDir, 'main');
      try {
        const { stdout, stderr } = await exec(`g++ ${sourcePath} -O2 -std=c++17 -o ${outExe}`, { timeout: 10000 });
        compileOutput = (stdout || '') + (stderr || '');
      } catch (e) {
          compileOutput = (e.stdout || '') + (e.stderr || '') + '\n' + (e.message || String(e));
          return { compileOutput, stdout: '', stderr: '', error: e.message || 'Compilation failed' };
      }
      runCmd = outExe;
    } else if (language === 'java') {
      try {
        const { stdout, stderr } = await exec(`javac ${sourcePath}`, { timeout: 15000, cwd: tmpDir });
        compileOutput = (stdout || '') + (stderr || '');
      } catch (e) {
          compileOutput = (e.stdout || '') + (e.stderr || '') + '\n' + (e.message || String(e));
          return { compileOutput, stdout: '', stderr: '', error: e.message || 'Compilation failed' };
      }
      runCmd = `java -cp ${tmpDir} Main`;
    } else if (language === 'go') {
      runCmd = `go run ${sourcePath}`;
    }

    try {
      const { stdout, stderr } = await exec(runCmd, { timeout: 5000, maxBuffer: 200 * 1024 });
      return { compileOutput, stdout, stderr, error: null };
    } catch (e) {
      const stdout = e.stdout || '';
      const stderr = e.stderr || '';
      console.error('[runner] exec error', String(e), e.stdout ? '[stdout]' : '', e.stdout || '', e.stderr ? '[stderr]' : '', e.stderr || '')
      return { compileOutput, stdout, stderr, error: 'Execution failed or timed out' };
    }
  } finally {
    try { await fs.rm(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}
