import { useParams, useNavigate } from "react-router-dom"
import Editor from "@monaco-editor/react"
import { useRef, useState, useEffect } from "react"
import lessons from "@u/lessons"
import { judgeOutput } from "@u/judge"
import useProgress from "@/hooks/useProgress"
import {
  isSkillUnlocked,
  isSkillCompleted,
  getProgress,
  awardXp,
  getLevelFromTotalXp,
  spendXp,
  revealHint,
  completeSkill,
  unlockNextSkill,
} from "@u/progress"

export default function Lesson() {
  const { lang, skill } = useParams()
  const navigate = useNavigate()

  // Get lesson data
  const lessonKey = `${lang}:${skill}`
  const lesson = lessons[lessonKey]

  const save = useProgress()

  const editorRef = useRef(null)
  const workerRef = useRef(null)
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [judgeResult, setJudgeResult] = useState(null) // { isCorrect, feedback }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [levelUp, setLevelUp] = useState(false)

  // Monaco language mapping and runtime support
  const languageMap = {
    javascript: "javascript",
    js: "javascript",
    react: "javascript",
    python: "python",
    py: "python",
    cpp: "cpp",
    cplusplus: "cpp",
  }

  const monacoLanguage = languageMap[lesson.lang] || "plaintext"
  const runnableLanguages = ["javascript", "js"]
  const isRunnable = runnableLanguages.includes(lesson.lang)

  const [availableLanguages, setAvailableLanguages] = useState([])
  const isRemoteRunnable = availableLanguages.includes(lesson.lang)

  // Check if skill is unlocked
  useEffect(() => {
    if (!isSkillUnlocked(lang, skill)) {
      navigate(`/learn/${lang}`)
    }
  }, [lang, skill, navigate])

  // If lesson doesn't exist, redirect
  if (!lesson) {
    navigate(`/learn/${lang}`)
    return null
  }

  const skillCompleted = isSkillCompleted(lang, skill)
  const hintsRevealed = save.hintsRevealed?.[lessonKey] || 0
  const maxHints = (lesson.hints || []).length

  function handleEditorDidMount(editor) {
    editorRef.current = editor
    editor.setValue(lesson.initialCode)
  }

  // When lesson changes, reload editor contents and reset state
  useEffect(() => {
    // terminate any running worker
    if (workerRef.current) {
      try {
        workerRef.current.terminate()
      } catch (_) {}
      workerRef.current = null
    }

    setOutput([])
    setJudgeResult(null)
    setIsRunning(false)
    setLevelUp(false)

    if (editorRef.current) {
      try {
        editorRef.current.setValue(lesson.initialCode)
      } catch (_) {
        // ignore if editor not ready
      }
    }
  }, [lessonKey])

  // Fetch available languages from runner server so we can enable server-side runs
  useEffect(() => {
    const runnerUrl = (import.meta.env?.VITE_RUNNER_URL) || 'http://localhost:5000'
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${runnerUrl}/languages`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data.languages) {
          setAvailableLanguages(data.languages.map((l) => l.key))
        }
      } catch (e) {
        // ignore - server may be offline or on a different port
      }
    })()

    return () => {
      cancelled = true
    }
  }, [lang, skill])

  function runCode() {
    if (isRunning || isSubmitting) return

    const code = editorRef.current.getValue()
    setOutput([])
    setJudgeResult(null)
    setIsRunning(true)
    document.body.style.cursor = "wait"

    // If the language is runnable in-browser (JS), use the worker.
    if (isRunnable) {
      if (workerRef.current) {
        workerRef.current.terminate()
      }

      const worker = new Worker(
        new URL("../workers/jsRunner.worker.js", import.meta.url)
      )

      workerRef.current = worker

      worker.onmessage = (e) => {
        setOutput(
          e.data.logs?.length
            ? e.data.logs
            : [{ type: "log", message: "(no output)" }]
        )

        cleanup()
      }

      worker.onerror = (err) => {
        setOutput([{ type: "error", message: err.message }])
        cleanup()
      }

      worker.postMessage(code)

      // hard timeout (infinite loop protection)
      setTimeout(() => {
        if (workerRef.current) {
          workerRef.current.terminate()
          setOutput((prev) =>
            prev.length
              ? prev
              : [{ type: "runtime", message: "⏱ Execution timed out" }]
          )
          cleanup()
        }
      }, 2000)
      return
    }

    // Otherwise, send code to backend runner for compilation/execution
    ;(async () => {
      const runnerUrl = (import.meta.env?.VITE_RUNNER_URL) || 'http://localhost:5000'
      if (!isRemoteRunnable) {
        setOutput([{ type: 'runtime', message: 'Runtime not available for this language.' }])
        cleanup()
        return
      }
      try {
        const res = await fetch(`${runnerUrl}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lesson.lang, code }),
        })

        if (!res.ok) {
          const text = await res.text()
          setOutput([{ type: 'error', message: `Runner error: ${res.status} ${text}` }])
          return
        }

        const data = await res.json()
        const out = []

        // Treat compileOutput as error messages so they don't affect judging
        if (data.compileOutput) {
          data.compileOutput
            .toString()
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean)
            .forEach((line) => out.push({ type: 'error', message: line }))
        }

        // Split stdout into separate log lines (important for line-by-line judging)
        if (data.stdout) {
          data.stdout
            .toString()
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean)
            .forEach((line) => out.push({ type: 'log', message: line }))
        }

        if (data.stderr) {
          data.stderr
            .toString()
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean)
            .forEach((line) => out.push({ type: 'error', message: line }))
        }

        if (data.error) {
          out.push({ type: 'runtime', message: data.error })
        }

        if (out.length === 0) out.push({ type: 'log', message: '(no output)' })

        setOutput(out)
      } catch (err) {
        setOutput([{ type: 'error', message: String(err) }])
      } finally {
        cleanup()
      }
    })()
  }

  function handleSubmit() {
    if (isSubmitting || output.length === 0) return

    setIsSubmitting(true)

    ;(async () => {
      try {
        // If lesson provides test cases and the runner supports the language, prefer server judge.
        if (Array.isArray(lesson.tests) && lesson.tests.length && isRemoteRunnable) {
          const runnerUrl = (import.meta.env?.VITE_RUNNER_URL) || 'http://localhost:5000'
          const code = editorRef.current.getValue()
          const res = await fetch(`${runnerUrl}/judge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: lesson.lang, code, tests: lesson.tests }),
          })
          const data = await res.json()
          if (data.ok) {
            setJudgeResult({ isCorrect: true, feedback: 'Accepted.' })
          } else {
            const f = (data.results || []).find((r) => !r.passed) || data.results?.[0]
            const msg = f?.compileOutput
              ? 'Compilation failed.'
              : f?.error
              ? String(f.error)
              : `Failed test #${(data.failedIndex ?? 0) + 1}`
            setJudgeResult({ isCorrect: false, feedback: msg })

            // Put the interesting diff in the output panel (quiet but useful)
            if (f && !f.compileOutput && !f.error) {
              setOutput([
                { type: 'warn', message: `stdin: ${JSON.stringify(f.stdin || '')}` },
                { type: 'warn', message: `expected: ${JSON.stringify(f.expectedStdout || '')}` },
                { type: 'warn', message: `got: ${JSON.stringify(f.stdout || '')}` },
              ])
            }
          }
        } else {
          const result = judgeOutput(output, lesson.expectedOutput)
          setJudgeResult(result)
          if (!result.isCorrect) return
        }

        // Victory path
        const beforeLevel = getLevelFromTotalXp(getProgress().player?.xpTotal || 0)
        awardXp(lesson.xp || 0)
        const afterLevel = getLevelFromTotalXp(getProgress().player?.xpTotal || 0)
        setLevelUp(afterLevel > beforeLevel)

        completeSkill(lang, skill)
        if (lesson.nextSkill) unlockNextSkill(lang, lesson.nextSkill)
      } finally {
        setIsSubmitting(false)
      }
    })()
  }

  function cleanup() {
    setIsRunning(false)
    document.body.style.cursor = "default"
    workerRef.current = null
  }

  return (
    <section className="min-h-dvh flex bg-transparent">
      {/* LEFT — THEORY */}
      <div className="w-1/2 border-r border-white/10 px-8 py-8 overflow-y-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">
              {lang.toUpperCase()}
            </span>
            <div className="ml-2 flex items-center gap-2">
              <div className="text-xs px-2 py-1 bg-white/5 rounded font-medium">{lesson.xp} XP</div>
              <div className="text-xs px-2 py-1 bg-white/5 rounded">Difficulty: {lesson.difficulty}</div>
            </div>
            {skillCompleted && (
              <span className="text-xs font-mono bg-emerald-500/15 text-emerald-200 px-2 py-1 rounded">
                ✓ Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">{lesson.title}</h1>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/80">
            {lesson.theory.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(lesson.tags || []).map((t) => (
              <div key={t} className="text-xs px-2 py-1 bg-white/5 rounded">
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-semibold mb-3">Example</h3>
            <pre className="bg-white/5 p-4 rounded text-xs overflow-x-auto font-mono leading-relaxed text-white/70">
              {lesson.codeExample}
            </pre>
          </div>
        </div>
      </div>

      {/* RIGHT — PRACTICE */}
      <div className="w-1/2 px-8 py-8 flex flex-col h-[calc(100dvh-80px)] sticky top-20 overflow-y-auto">
        <h2 className="text-2xl font-bold">Practice</h2>

        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/85">
          {lesson.task}
        </div>

        <div className="mt-3 text-sm text-white/60">Checks: {lesson.expectedOutput.length}</div>

        {/* Monaco Editor */}
        <div className="mt-6 flex-1 border border-white/10 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-white/60 flex items-center justify-between">
            <div>{lesson.lang.toUpperCase()}</div>
            <div className="text-xs text-white/50">{monacoLanguage}</div>
          </div>
          <Editor
            key={lessonKey}
            height="100%"
            defaultLanguage={monacoLanguage}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Output */}
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2">Output</div>
          <div className="bg-black/95 text-white rounded p-3 min-h-24 max-h-32 overflow-y-auto text-xs font-mono whitespace-pre-wrap">
            {output.length === 0 ? (
              <span className="text-black/40">Run code to see output...</span>
            ) : (
              output.map((item, i) => (
                <div
                  key={i}
                  className={
                    item.type === "error" || item.type === "runtime"
                      ? "text-red-400"
                      : item.type === "warn"
                      ? "text-yellow-400"
                      : "text-white"
                  }
                >
                  {item.type === "warn" && "⚠️ "}
                  {(item.type === "error" || item.type === "runtime") && "❌ "}
                  {item.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Judge Result */}
        {judgeResult && (
          <div
            className={`mt-3 p-3 rounded text-sm ${
              judgeResult.isCorrect
                ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20"
                : "bg-red-500/15 text-red-200 border border-red-500/20"
            }`}
          >
            <div className="font-semibold">
              {judgeResult.isCorrect ? "✓ " : "✗ "}
              {judgeResult.feedback}
            </div>
            {judgeResult.isCorrect && levelUp && (
              <div className="text-xs mt-1 opacity-80">Level up.</div>
            )}
          </div>
        )}

        {showHints && lesson.hints && (
          <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded text-sm text-white/85">
            <div className="font-medium mb-2">Whispers</div>
            {hintsRevealed === 0 ? (
              <div className="text-white/60 text-sm">
                No whispers yet. Purchase one to reveal guidance.
              </div>
            ) : (
              <ul className="list-disc list-inside text-sm space-y-1">
                {lesson.hints.slice(0, hintsRevealed).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex items-center gap-3">
              <button
                className="px-3 py-2 text-sm rounded bg-white text-black disabled:opacity-50"
                disabled={hintsRevealed >= maxHints}
                onClick={() => {
                  const cost = 25
                  const r = spendXp(cost)
                  if (!r.ok) {
                    setOutput([{ type: 'runtime', message: 'Not enough XP to buy a hint.' }])
                    return
                  }
                  revealHint(lessonKey, 1)
                }}
              >
                Buy hint (25 XP)
              </button>
              <div className="text-xs text-white/60">Revealed: {Math.min(hintsRevealed, maxHints)}/{maxHints}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              if (!isRunnable && !isRemoteRunnable) {
                setOutput([{ type: "runtime", message: "Runtime not available for this language." }])
                return
              }
              runCode()
            }}
            disabled={isRunning || isSubmitting || (!isRunnable && !isRemoteRunnable)}
            className={`
              px-4 py-2 border border-white/15 rounded text-sm font-medium
              transition
              ${
                isRunning || isSubmitting
                  ? "opacity-50 cursor-not-allowed bg-white/5"
                  : "cursor-pointer hover:bg-white/5 active:bg-white/10"
              }
            `}
          >
            {isRunning ? "Running..." : "Run"}
          </button>



          <button
            onClick={handleSubmit}
            disabled={isSubmitting || output.length === 0 || skillCompleted}
            className={`
              px-4 py-2 rounded text-sm font-medium
              transition
              ${
                isSubmitting || output.length === 0 || skillCompleted
                  ? "opacity-50 cursor-not-allowed bg-white/10 text-white/40"
                  : "bg-white text-black cursor-pointer hover:bg-white/90 active:bg-white/80"
              }
            `}
          >
            {isSubmitting ? "Checking..." : skillCompleted ? "Completed" : "Submit"}
          </button>

          <button
            onClick={() => setShowHints((s) => !s)}
            className="ml-auto px-3 py-2 text-sm rounded border border-white/10 hover:bg-white/5"
          >
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>

          {lesson.nextSkill && skillCompleted && (
            <button
              onClick={() => navigate(`/learn/${lang}/${lesson.nextSkill}`)}
              className="ml-auto px-4 py-2 text-sm font-medium underline hover:opacity-70"
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
