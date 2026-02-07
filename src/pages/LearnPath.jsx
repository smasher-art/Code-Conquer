import { useParams, useNavigate } from "react-router-dom"
import lessons from "@u/lessons"
import useProgress from "@/hooks/useProgress"

export default function LearnPath() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const save = useProgress()

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
        <p className="text-white/60 mt-2">Trials unlock through mastery</p>
      </div>

      {/* Path */}
      <div className="mt-12 flex flex-col items-center w-full max-w-md">
        {treeLessons.map((lesson, index) => {
          const isLast = index === treeLessons.length - 1
          const id = lesson.skill
          const label = lesson.title

          const unlocked = (save.skills?.unlocked?.[lang] || []).includes(id)
          const completed = (save.skills?.completed?.[lang] || []).includes(id)
          const status = completed ? "completed" : unlocked ? "active" : "locked"

          const displayLabel = status === "locked" ? "???" : label

          return (
            <div key={id} className="flex flex-col items-center w-full">
                  <div
                    className={`
                      w-full px-5 py-4 rounded-xl border text-center transition
                      ${
                        status === "active"
                          ? "border-white/15 bg-white text-black cursor-pointer"
                          : status === "completed"
                          ? "border-white/10 bg-white/5 text-white opacity-70 cursor-pointer"
                          : "border-white/10 bg-white/5 text-white/50 cursor-not-allowed"
                      }
                    `}
                    onClick={() => {
                      // allow opening active or completed lessons for viewing
                      if (status === "active" || status === "completed") {
                        navigate(`/learn/${lang}/${id}`)
                      }
                    }}
                    title={status === "locked" ? "Sealed" : "Open trial"}
                  >
                <p className="font-medium">{displayLabel}</p>

                <p className="text-sm mt-1">
                  {status === "completed" && "✔ Completed"}
                  {status === "active" && "▶ Start"}
                  {status === "locked" && "Sealed"}
                </p>
              </div>

              {!isLast && <div className="w-px h-10 bg-white/10" />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
