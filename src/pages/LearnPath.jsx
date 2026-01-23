import { useParams, useNavigate } from "react-router-dom"
import { learnTrees } from "@u/constants/learnTrees"

export default function LearnPath() {
  const { lang } = useParams()
  const navigate = useNavigate()

  const tree = learnTrees[lang]

  if (!tree) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Path not found
      </div>
    )
  }

  return (
    <section className="min-h-dvh flex flex-col items-center pt-10 px-4">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold">{tree.title}</h1>
        <p className="text-black/60 mt-2">{tree.description}</p>
      </div>

      {/* Path */}
      <div className="mt-12 flex flex-col items-center w-full max-w-md">

        {tree.nodes.map((skill, index) => {
          const isLast = index === tree.nodes.length - 1

          return (
            <div key={skill.id} className="flex flex-col items-center w-full">

              {/* Skill Node */}
              <div
                className={`
                  w-full px-5 py-4 rounded-xl border-2 text-center transition
                  ${
                    skill.status === "active"
                      ? "border-black bg-black text-white cursor-pointer"
                      : skill.status === "completed"
                      ? "border-black bg-white text-black opacity-70"
                      : "border-black/20 bg-white text-black/40 cursor-not-allowed"
                  }
                `}
                onClick={() => {
                  if (skill.status === "active") {
                    navigate(`/learn/${lang}/${skill.id}`)
                  }
                }}
                title={
                  skill.status === "locked"
                    ? "Complete previous skill to unlock"
                    : ""
                }
              >
                <p className="font-medium">{skill.label}</p>

                <p className="text-sm mt-1">
                  {skill.status === "completed" && "✔ Completed"}
                  {skill.status === "active" && "▶ Start"}
                  {skill.status === "locked" && "🔒 Locked"}
                </p>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="w-px h-10 bg-black/20" />
              )}
            </div>
          )
        })}
      </div>

    </section>
  )
}
