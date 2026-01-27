import React, { useMemo } from "react"
import ReactFlow, { Controls } from "reactflow"
import "reactflow/dist/style.css"
import { useNavigate } from "react-router-dom"
import getLanguages from "@u/languages"
import { getProgress } from "@u/progress"

export default function Learn() {
  const navigate = useNavigate()

  const languages = useMemo(() => getLanguages(), [])

  const progress = useMemo(() => getProgress(), [])

  const baseNodeStyle = {
    borderRadius: "50%",
    width: 110,
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14,
  }

  // Build nodes dynamically: root + each language positioned horizontally
  const nodes = useMemo(() => {
    const root = {
      id: "root",
      position: { x: 250, y: 0 },
      data: { label: "Paths" },
      style: { ...baseNodeStyle, background: "white", color: "black", border: "2px solid black" },
    }

    const langNodes = languages.map((lang, idx) => {
      const spacing = 160
      const x = 50 + idx * spacing
      const unlocked = (progress.unlockedSkills[lang.slug] || []).length > 0

      return {
        id: lang.slug,
        position: { x, y: 180 },
        data: { label: lang.label },
        style: {
          ...baseNodeStyle,
          background: unlocked ? "black" : "#00000010",
          color: unlocked ? "white" : "#00000070",
          cursor: unlocked ? "pointer" : "not-allowed",
          border: unlocked ? "2px solid black" : "1px solid #e5e7eb",
        },
      }
    })

    return [root, ...langNodes]
  }, [languages, progress])

  const edges = useMemo(() => {
    return languages.map((lang) => ({
      id: `e-root-${lang.slug}`,
      source: "root",
      target: lang.slug,
      style: { strokeWidth: 2, strokeOpacity: (progress.unlockedSkills[lang.slug] || []).length ? 1 : 0.4 },
    }))
  }, [languages, progress])

  return (
    <section className="flex-1 flex flex-col items-center pt-10 gap-4">

      <h1 className="text-5xl font-semibold">LEARN</h1>
      <p className="text-black/60">Choose a language path</p>

      <div className="w-full h-175 px-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          onNodeClick={(e, node) => {
            // Navigate to language path if unlocked
            const unlocked = (progress.unlockedSkills[node.id] || []).length > 0
            if (unlocked) navigate(`/learn/${node.id}`)
          }}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <p className="text-sm text-black/50 italic">* Paths shown are driven from lesson data</p>

    </section>
  )
}
