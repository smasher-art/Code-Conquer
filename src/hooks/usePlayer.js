import useProgress from "./useProgress"
import { getLevelFromTotalXp, getXpForNextLevel } from "@u/progress"

export default function usePlayer() {
  const save = useProgress()
  const player = save.player
  const level = getLevelFromTotalXp(player.xpTotal)
  const { currentReq, nextReq } = getXpForNextLevel(level)

  const intoLevel = Math.max(0, player.xpTotal - currentReq)
  const span = Math.max(1, nextReq - currentReq)
  const pct = Math.min(100, Math.round((intoLevel / span) * 100))

  return {
    save,
    player,
    level,
    xp: {
      currentReq,
      nextReq,
      intoLevel,
      span,
      pct,
    },
  }
}
