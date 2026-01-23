import { NavLink } from "react-router-dom"

export default function Learn() {
  return (
    <section className="min-h-dvh flex flex-col items-center pt-16">

      {/* Title */}
      <h1 className="text-5xl font-semibold mb-20">LEARN</h1>

      {/* Tree Container */}
      <div className="relative flex flex-col items-center">

        {/* Root Node */}
        <div className="w-24 h-24 rounded-full bg-black text-white
                        flex items-center justify-center text-xl font-medium">
          Learn
        </div>

        {/* Vertical line down */}
        <div className="w-px h-20 bg-black" />

        {/* Branches */}
        <div className="relative w-[500px] h-20">
          {/* Horizontal line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2
                          w-full h-px bg-black" />

          {/* Left vertical */}
          <div className="absolute left-0 top-0 w-px h-20 bg-black" />
          {/* Middle vertical */}
          <div className="absolute left-1/2 top-0 w-px h-20 bg-black" />
          {/* Right vertical */}
          <div className="absolute right-0 top-0 w-px h-20 bg-black" />
        </div>

        {/* Language Nodes */}
        <div className="flex justify-between w-[500px]">

          {/* JS (Active) */}
          <NavLink
            to="/learn/js"
            className="w-20 h-20 rounded-full bg-black text-white
                       flex items-center justify-center text-sm
                       hover:scale-105 transition"
          >
            JS
          </NavLink>

          {/* Python (Locked) */}
          <div
            className="w-20 h-20 rounded-full bg-black/20 text-black/40
                       flex items-center justify-center text-sm
                       cursor-not-allowed"
          >
            Python
          </div>

          {/* C++ (Locked) */}
          <div
            className="w-20 h-20 rounded-full bg-black/20 text-black/40
                       flex items-center justify-center text-sm
                       cursor-not-allowed"
          >
            C++
          </div>

        </div>
      </div>

      {/* Trial note */}
      <p className="mt-20 text-sm text-black/50 italic">
        * Free trial — JavaScript path only (for now 😏)
      </p>

    </section>
  )
}
