import usePlayer from "@/hooks/usePlayer"
import lessons from "@u/lessons"
import { resetProgress } from "@u/progress"
import { apiFetch } from "@/services/apiClient"
import { setProgressFromServer } from "@/services/progressSync"

export default function Profile() {
  const { save, player, level, xp } = usePlayer()

  const completedByLang = save.skills?.completed || {}
  const unlockedByLang = save.skills?.unlocked || {}

  const allLessons = Object.values(lessons)
  const totalSkillsByLang = allLessons.reduce((acc, l) => {
    acc[l.lang] = (acc[l.lang] || 0) + 1
    return acc
  }, {})

  return (
    <section className="flex-1 flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold">Character Sheet</h1>
            <p className="text-white/60 mt-2">{player.displayName}</p>
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded border border-white/10 text-sm hover:bg-white/5"
              onClick={async () => {
                try {
                  const data = await apiFetch('/api/me/progress')
                  if (data?.save) {
                    setProgressFromServer(data.save)
                    alert('Loaded from server.')
                  } else {
                    alert('No save returned.')
                  }
                } catch (e) {
                  alert(String(e.message || e))
                }
              }}
            >
              Load
            </button>
            <button
              className="px-4 py-2 rounded border border-white/10 text-sm hover:bg-white/5"
              onClick={async () => {
                try {
                  await apiFetch('/api/me/progress', { method: 'PUT', body: { save } })
                  alert('Synced to server.')
                } catch (e) {
                  alert(String(e.message || e))
                }
              }}
            >
              Sync
            </button>
            <button
              className="px-4 py-2 rounded border border-white/10 text-sm hover:bg-white/5"
              onClick={() => {
                if (confirm("Reset all progress? This cannot be undone.")) {
                  resetProgress()
                }
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-xs text-white/60">Level</div>
            <div className="text-2xl font-semibold mt-1">{level}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-xs text-white/60">Total XP</div>
            <div className="text-2xl font-semibold mt-1">{player.xpTotal}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-xs text-white/60">Unspent XP</div>
            <div className="text-2xl font-semibold mt-1">{player.xpUnspent}</div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="text-xs text-white/60 mb-2">Next level progress</div>
          <div className="h-2 rounded bg-white/10 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${xp.pct}%` }} />
          </div>
          <div className="text-[11px] text-white/50 mt-2 text-right">
            {xp.intoLevel}/{xp.span}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Paths</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(totalSkillsByLang)
              .sort()
              .map((lang) => {
                const completed = completedByLang[lang] || []
                const unlocked = unlockedByLang[lang] || []
                const total = totalSkillsByLang[lang] || 0

                return (
                  <div key={lang} className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{lang.toUpperCase()}</div>
                      <div className="text-xs text-white/60">
                        {completed.length}/{total} completed
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-white/60">
                      Unlocked: {unlocked.length}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {completed.slice(0, 6).map((s) => (
                        <span key={s} className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10">
                          {s}
                        </span>
                      ))}
                      {completed.length > 6 && (
                        <span className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10">
                          +{completed.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
