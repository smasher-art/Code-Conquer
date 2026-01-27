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

    // split languages into top-level (no parent) and children (with parent)
    const top = languages.filter((l) => !l.parent)
    const children = languages.filter((l) => l.parent)

    const spacing = 160
    const topNodes = top.map((lang, idx) => {
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

    // for child languages, place below their parent (same x as parent if available)
    const childNodes = children.map((lang, idx) => {
      const parentNode = topNodes.find((n) => n.id === lang.parent)
      const x = parentNode ? parentNode.position.x : 50 + idx * spacing
      const y = 320
      const unlocked = (progress.unlockedSkills[lang.slug] || []).length > 0
      return {
        id: lang.slug,
        position: { x, y },
        data: { label: lang.label },
        style: {
          ...baseNodeStyle,
          width: 90,
          height: 90,
          background: unlocked ? "black" : "#00000010",
          color: unlocked ? "white" : "#00000070",
          cursor: unlocked ? "pointer" : "not-allowed",
          border: unlocked ? "2px solid black" : "1px solid #e5e7eb",
        },
      }
    })

    return [root, ...topNodes, ...childNodes]
  }, [languages, progress])

  const edges = useMemo(() => {
    const top = languages.filter((l) => !l.parent)
    const children = languages.filter((l) => l.parent)

    const rootEdges = top.map((lang) => ({
      id: `e-root-${lang.slug}`,
      source: "root",
      target: lang.slug,
      style: { strokeWidth: 2, strokeOpacity: (progress.unlockedSkills[lang.slug] || []).length ? 1 : 0.4 },
    }))

    const parentEdges = children.map((lang) => ({
      id: `e-${lang.parent}-${lang.slug}`,
      source: lang.parent,
      target: lang.slug,
      style: { strokeWidth: 2, strokeOpacity: (progress.unlockedSkills[lang.slug] || []).length ? 1 : 0.4 },
    }))

    return [...rootEdges, ...parentEdges]
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
