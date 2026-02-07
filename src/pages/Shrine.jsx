import usePlayer from "@/hooks/usePlayer"
import { spendXp } from "@u/progress"

const ITEMS = [
  {
    id: "hint",
    name: "Whisper (Hint)",
    desc: "Reveals guidance during a Trial.",
    cost: 25,
  },
  {
    id: "sigil",
    name: "Unlock Sigil (Soon)",
    desc: "Unlock a mysterious skill early (future).",
    cost: 100,
    disabled: true,
  },
]

export default function Shrine() {
  const { player } = usePlayer()

  return (
    <section className="flex-1 flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-semibold">Shrine</h1>
        <p className="text-white/60 mt-2">Spend unspent XP for assistance.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ITEMS.map((it) => (
            <div key={it.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-white/60 mt-1">{it.desc}</div>
                </div>
                <div className="text-sm text-white/70">{it.cost} XP</div>
              </div>

              <button
                disabled={it.disabled || player.xpUnspent < it.cost}
                className="mt-4 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-50"
                onClick={() => {
                  const r = spendXp(it.cost)
                  if (!r.ok) alert(r.error)
                  else alert("Purchased. Use hints inside a lesson.")
                }}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-white/50">
          Hint spending is currently handled in-lesson. This page is the foundation for crafting/unlocks.
        </div>
      </div>
    </section>
  )
}
