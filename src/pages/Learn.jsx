import React from "react"
import ReactFlow, { Controls } from "reactflow"
import "reactflow/dist/style.css"
import { useNavigate } from "react-router-dom"

export default function Learn() {
  const navigate = useNavigate()

  const baseNodeStyle = {
    borderRadius: "50%",
    width: 90,
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    fontSize: 14,
  }

  const nodes = [
    {
      id: "root",
      position: { x: 230, y: 0 },
      data: { label: "Paths" },
      style: {
        ...baseNodeStyle,
        background: "white",
        color: "black",
        border: "2px solid black",
      },
    },

    {
      id: "js",
      position: { x: 50, y: 200 },
      data: { label: "JavaScript" },
      style: {
        ...baseNodeStyle,
        background: "black",
        color: "white",
        cursor: "pointer",
      },
    },

    {
      id: "py",
      position: { x: 250, y: 200 },
      data: { label: "Python" },
      style: {
        ...baseNodeStyle,
        background: "#00000020",
        color: "#00000070",
        cursor: "not-allowed",
      },
    },

    {
      id: "cpp",
      position: { x: 450, y: 200 },
      data: { label: "C++" },
      style: {
        ...baseNodeStyle,
        background: "#00000020",
        color: "#00000070",
        cursor: "not-allowed",
      },
    },
  ]

  const edges = [
    {
      id: "e-root-js",
      source: "root",
      target: "js",
      style: { strokeWidth: 2 },
    },
    {
      id: "e-root-py",
      source: "root",
      target: "py",
      style: { strokeWidth: 2, strokeOpacity: 0.4 },
    },
    {
      id: "e-root-cpp",
      source: "root",
      target: "cpp",
      style: { strokeWidth: 2, strokeOpacity: 0.4 },
    },
  ]

  return (
    <section className="flex-1 flex flex-col items-center pt-10 gap-4">

      <h1 className="text-5xl font-semibold">LEARN</h1>
      <p className="text-black/60">
        Choose a language path
      </p>

      <div className="w-full h-175 px-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          onNodeClick={(e, node) => {
            if (node.id === "js") navigate("/learn/js")
          }}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <p className="text-sm text-black/50 italic">
        * Free trial — JavaScript path only (for now 😏)
      </p>

    </section>
  )
}
