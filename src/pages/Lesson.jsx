import { useParams } from "react-router-dom"
import Editor from "@monaco-editor/react"

export default function Lesson() {
  const { lang, skill } = useParams()

  return (
    <section className="min-h-dvh flex">

      {/* LEFT — THEORY */}
      <div className="w-1/2 border-r border-black/10 px-6 py-6 overflow-y-auto">

        <h1 className="text-2xl font-semibold capitalize">
          {skill.replace("-", " ")}
        </h1>

        <p className="text-black/60 mt-2">
          {lang.toUpperCase()} · Lesson
        </p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed">

          <p>
            Variables are used to store data values in a program.
            In JavaScript, you can declare variables using
            <code className="mx-1 px-1 bg-black/5 rounded">let</code>,
            <code className="mx-1 px-1 bg-black/5 rounded">const</code>,
            or
            <code className="mx-1 px-1 bg-black/5 rounded">var</code>.
          </p>

          <pre className="bg-black/5 p-4 rounded text-xs overflow-x-auto">
{`let score = 10;
const name = "Reaper";

console.log(score, name);`}
          </pre>

        </div>
      </div>

      {/* RIGHT — PRACTICE */}
      <div className="w-1/2 px-6 py-6 flex flex-col">

        <h2 className="text-xl font-semibold">Practice</h2>

        <p className="text-black/60 mt-1 text-sm">
          Write code to solve the task below
        </p>

        <div className="mt-4 text-sm">
          Create a variable called <code>age</code> and assign it
          the value <code>18</code>. Then log it to the console.
        </div>

        {/* Monaco Editor */}
        <div className="mt-4 flex-1 border border-black/20 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={`// write your code here`}
            theme="vs-light"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 border border-black rounded-md text-sm">
            Run
          </button>

          <button className="px-4 py-2 bg-black text-white rounded-md text-sm">
            Submit
          </button>

          <button className="ml-auto px-4 py-2 text-sm underline">
            Complete Lesson
          </button>
        </div>

      </div>
    </section>
  )
}
