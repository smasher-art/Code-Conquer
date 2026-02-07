import React, { useMemo } from "react"
import ReactFlow, { Controls } from "reactflow"
import "reactflow/dist/style.css"
import { useNavigate } from "react-router-dom"
import getLanguages from "@u/languages"
import useProgress from "@/hooks/useProgress"
import lessons from "@u/lessons"

export default function Learn() {
  const navigate = useNavigate()

  const languages = useMemo(() => getLanguages(), [])

  const progress = useProgress()

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
      style: { ...baseNodeStyle, background: "#ffffff", color: "#000000", border: "1px solid rgba(255,255,255,0.25)" },
    }

    // split languages into top-level (no parent) and children (with parent)
    const top = languages.filter((l) => !l.parent)
    const children = languages.filter((l) => l.parent)

    const spacing = 160
    const topNodes = top.map((lang, idx) => {
      const x = 50 + idx * spacing
      const unlocked = ((progress.skills?.unlocked?.[lang.slug]) || []).length > 0
      return {
        id: lang.slug,
        position: { x, y: 180 },
        data: { label: lang.label },
        style: {
          ...baseNodeStyle,
          background: unlocked ? "#ffffff" : "rgba(255,255,255,0.06)",
          color: unlocked ? "#000000" : "rgba(255,255,255,0.55)",
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.12)",
        },
      }
    })

    // helper: check whether all lessons for a language are completed
    const isLangFullyCompleted = (langSlug) => {
      const lessonsForLang = Object.values(lessons).filter((l) => l.lang === langSlug)
      if (!lessonsForLang.length) return false
      const completedList = (progress.skills?.completed?.[langSlug]) || []
      // ensure every lesson skill for the language is present in completedList
      return lessonsForLang.every((ls) => completedList.includes(ls.skill))
    }

    // for child languages, only show them when their parent language is fully completed
    const childNodes = children
      .filter((lang) => isLangFullyCompleted(lang.parent))
      .map((lang, idx) => {
        const parentNode = topNodes.find((n) => n.id === lang.parent)
        const x = parentNode ? parentNode.position.x : 50 + idx * spacing
        const y = 320
        const unlocked = ((progress.skills?.unlocked?.[lang.slug]) || []).length > 0
        return {
          id: lang.slug,
          position: { x, y },
          data: { label: lang.label },
          style: {
            ...baseNodeStyle,
            width: 90,
            height: 90,
            background: unlocked ? "#ffffff" : "rgba(255,255,255,0.06)",
            color: unlocked ? "#000000" : "rgba(255,255,255,0.55)",
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }
      })

    return [root, ...topNodes, ...childNodes]
  }, [languages, progress])

  const edges = useMemo(() => {
    const top = languages.filter((l) => !l.parent)
    const children = languages.filter((l) => l.parent)
    const isLangFullyCompleted = (langSlug) => {
      const lessonsForLang = Object.values(lessons).filter((l) => l.lang === langSlug)
      if (!lessonsForLang.length) return false
      const completedList = (progress.skills?.completed?.[langSlug]) || []
      return lessonsForLang.every((ls) => completedList.includes(ls.skill))
    }

    const rootEdges = top.map((lang) => ({
      id: `e-root-${lang.slug}`,
      source: "root",
      target: lang.slug,
      style: { stroke: 'rgba(255,255,255,0.45)', strokeWidth: 2, strokeOpacity: ((progress.skills?.unlocked?.[lang.slug]) || []).length ? 1 : 0.35 },
    }))

    const parentEdges = children
      .filter((lang) => isLangFullyCompleted(lang.parent))
      .map((lang) => ({
        id: `e-${lang.parent}-${lang.slug}`,
        source: lang.parent,
        target: lang.slug,
        style: { stroke: 'rgba(255,255,255,0.45)', strokeWidth: 2, strokeOpacity: ((progress.skills?.unlocked?.[lang.slug]) || []).length ? 1 : 0.35 },
      }))

    return [...rootEdges, ...parentEdges]
  }, [languages, progress])

  return (
    <section className="flex-1 flex flex-col items-center pt-10 gap-4">

      <h1 className="text-5xl font-semibold">LEARN</h1>
      <p className="text-white/60">Choose a path</p>

      <div className="w-full h-175 px-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          onNodeClick={(e, node) => {
            // Navigate to language path for any language node (root excluded)
            if (node.id && node.id !== "root") {
              navigate(`/learn/${node.id}`)
            }
          }}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <p className="text-sm text-white/40 italic">* Paths are derived from lesson data</p>

    </section>
  )
}
