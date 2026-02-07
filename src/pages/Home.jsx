import { NavLink } from "react-router-dom"

export default function Home() {
  return (
    <section className="flex-1 flex flex-col gap-10 items-center justify-center -mt-16">

      <div className="flex gap-2.5 flex-col items-center">
        <h1 className="text-8xl font-Poppins font-semibold">
          Level Up
        </h1>
        <h2 className="text-4xl text-white/70">
          Your Coding Skills
        </h2>
      </div>

      <div className="flex flex-col gap-1 max-w-md text-center">
        <p>Solve bite-sized coding challenges.</p>
        <p>Earn XP. Unlock levels.</p>
      </div>

      <NavLink
        to="/learn"
        className="
        text-xl px-5 py-2.5 border border-white/15 rounded-lg
        bg-white text-black
        hover:bg-white/90 active:scale-95 transition
        "
      >
        Start Learning
      </NavLink>

    </section>
  )
}
