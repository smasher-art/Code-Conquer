import { useParams, useNavigate } from "react-router-dom"
import lessons from "@u/lessons"
import {
  isSkillUnlocked,
  isSkillCompleted,
} from "@u/progress"

export default function LearnPath() {
  const { lang } = useParams()
  const navigate = useNavigate()

  // Gather lessons for this language in insertion order
  const treeLessons = Object.values(lessons).filter((l) => l.lang === lang)

  if (!treeLessons.length) {
    return (
      <div className="min-h-dvh flex items-center justify-center">Path not found</div>
    )
  }

  return (
    <section className="min-h-dvh flex flex-col items-center pt-10 px-4">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold">{lang.toUpperCase()} Path</h1>
        <p className="text-black/60 mt-2">Unlock skills by completing them</p>
      </div>

      {/* Path */}
      <div className="mt-12 flex flex-col items-center w-full max-w-md">
        {treeLessons.map((lesson, index) => {
          const isLast = index === treeLessons.length - 1
          const id = lesson.skill
          const label = lesson.title

          const status = isSkillCompleted(lang, id)
            ? "completed"
            : isSkillUnlocked(lang, id)
            ? "active"
            : "locked"

          return (
            <div key={id} className="flex flex-col items-center w-full">
              <div
                className={`
                  w-full px-5 py-4 rounded-xl border-2 text-center transition
                  ${
                    status === "active"
                      ? "border-black bg-black text-white cursor-pointer"
                      : status === "completed"
                      ? "border-black bg-white text-black opacity-70"
                      : "border-black/20 bg-white text-black/40 cursor-not-allowed"
                  }
                `}
                onClick={() => {
                  if (status === "active") {
                    navigate(`/learn/${lang}/${id}`)
                  }
                }}
                title={status === "locked" ? "Complete previous skill to unlock" : ""}
              >
                <p className="font-medium">{label}</p>

                <p className="text-sm mt-1">
                  {status === "completed" && "✔ Completed"}
                  {status === "active" && "▶ Start"}
                  {status === "locked" && "🔒 Locked"}
                </p>
              </div>

              {!isLast && <div className="w-px h-10 bg-black/20" />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
