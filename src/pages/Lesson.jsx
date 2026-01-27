import { useParams, useNavigate } from "react-router-dom"
import Editor from "@monaco-editor/react"
import { useRef, useState, useEffect } from "react"
import lessons from "@u/lessons"
import { judgeOutput } from "@u/judge"
import {
  isSkillUnlocked,
  isSkillCompleted,
  completeSkill,
  unlockNextSkill,
} from "@u/progress"

export default function Lesson() {
  const { lang, skill } = useParams()
  const navigate = useNavigate()

  // Get lesson data
  const lessonKey = `${lang}:${skill}`
  const lesson = lessons[lessonKey]

  const editorRef = useRef(null)
  const workerRef = useRef(null)
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [judgeResult, setJudgeResult] = useState(null) // { isCorrect, feedback }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHints, setShowHints] = useState(false)

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

  function handleEditorDidMount(editor) {
    editorRef.current = editor
    editor.setValue(lesson.initialCode)
  }

  function runCode() {
    if (isRunning || isSubmitting) return

    const code = editorRef.current.getValue()
    setOutput([])
    setJudgeResult(null)
    setIsRunning(true)
    document.body.style.cursor = "wait"

    // kill old worker if exists
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
  }

  function handleSubmit() {
    if (isSubmitting || output.length === 0) return

    setIsSubmitting(true)
    const result = judgeOutput(output, lesson.expectedOutput)
    setJudgeResult(result)

    if (result.isCorrect) {
      completeSkill(lang, skill)
      if (lesson.nextSkill) {
        unlockNextSkill(lang, lesson.nextSkill)
      }
    }

    setIsSubmitting(false)
  }

  function cleanup() {
    setIsRunning(false)
    document.body.style.cursor = "default"
    workerRef.current = null
  }

  return (
    <section className="min-h-dvh flex bg-white">
      {/* LEFT — THEORY */}
      <div className="w-1/2 border-r border-black/10 px-8 py-8 overflow-y-auto">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-black/5 px-2 py-1 rounded">
              {lang.toUpperCase()}
            </span>
            <div className="ml-2 flex items-center gap-2">
              <div className="text-xs px-2 py-1 bg-black/5 rounded font-medium">{lesson.xp} XP</div>
              <div className="text-xs px-2 py-1 bg-black/5 rounded">Difficulty: {lesson.difficulty}</div>
            </div>
            {skillCompleted && (
              <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">
                ✓ Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">{lesson.title}</h1>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-black/80">
            {lesson.theory.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(lesson.tags || []).map((t) => (
              <div key={t} className="text-xs px-2 py-1 bg-black/5 rounded">
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-black/10">
            <h3 className="text-sm font-semibold mb-3">Example</h3>
            <pre className="bg-black/5 p-4 rounded text-xs overflow-x-auto font-mono leading-relaxed text-black/70">
              {lesson.codeExample}
            </pre>
          </div>
        </div>
      </div>

      {/* RIGHT — PRACTICE */}
      <div className="w-1/2 px-8 py-8 flex flex-col h-[calc(100dvh-80px)] sticky top-20 overflow-y-auto">
        <h2 className="text-2xl font-bold">Practice</h2>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          {lesson.task}
        </div>

        <div className="mt-3 text-sm text-black/60">Tests: {lesson.expectedOutput.length}</div>

        {/* Monaco Editor */}
        <div className="mt-6 flex-1 border border-black/20 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-black/5 px-4 py-2 border-b border-black/10 text-xs font-mono text-black/60 flex items-center justify-between">
            <div>{lesson.lang.toUpperCase()}</div>
            <div className="text-xs text-black/50">{monacoLanguage}</div>
          </div>
          <Editor
            height="100%"
            defaultLanguage={monacoLanguage}
            theme="vs-light"
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
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            <div className="font-semibold">
              {judgeResult.isCorrect ? "✓ " : "✗ "}
              {judgeResult.feedback}
            </div>
          </div>
        )}

        {showHints && lesson.hints && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
            <div className="font-medium mb-1">Hints</div>
            <ul className="list-disc list-inside text-sm">
              {lesson.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              if (!isRunnable) {
                setOutput([{ type: "runtime", message: "Runtime not supported for this language in-browser." }])
                return
              }
              runCode()
            }}
            disabled={isRunning || isSubmitting || !isRunnable}
            className={`
              px-4 py-2 border border-black/30 rounded text-sm font-medium
              transition
              ${
                isRunning || isSubmitting
                  ? "opacity-50 cursor-not-allowed bg-black/5"
                  : "cursor-pointer hover:bg-black/5 active:bg-black/10"
              }
            `}
          >
            {isRunning ? "Running..." : "Run"}
          </button>

          {!isRunnable && (
            <div className="ml-2 self-center text-xs text-black/50">Runtime not available — editor only</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || output.length === 0 || skillCompleted}
            className={`
              px-4 py-2 rounded text-sm font-medium
              transition
              ${
                isSubmitting || output.length === 0 || skillCompleted
                  ? "opacity-50 cursor-not-allowed bg-black/10 text-black/40"
                  : "bg-black text-white cursor-pointer hover:bg-black/80 active:bg-black/70"
              }
            `}
          >
            {isSubmitting ? "Checking..." : skillCompleted ? "Completed" : "Submit"}
          </button>

          <button
            onClick={() => setShowHints((s) => !s)}
            className="ml-auto px-3 py-2 text-sm rounded border border-black/10"
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
