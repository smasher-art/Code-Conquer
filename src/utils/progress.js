// localStorage utility for tracking progress

import lessons from "./lessons"

const STORAGE_KEY = "bebo_progress"

const SAVE_VERSION = 2

function nowIso() {
  return new Date().toISOString()
}

function clampNonNegative(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return 0
  return v < 0 ? 0 : v
}

// Level curve (tunable): XP required to reach level L is ~ 75*L^2
export function getLevelFromTotalXp(xpTotal) {
  const xp = clampNonNegative(xpTotal)
  let level = 1
  while (xp >= 75 * (level + 1) * (level + 1)) level += 1
  return level
}

export function getXpForNextLevel(level) {
  const lvl = Math.max(1, Number(level) || 1)
  const currentReq = 75 * lvl * lvl
  const nextReq = 75 * (lvl + 1) * (lvl + 1)
  return { currentReq, nextReq }
}

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const parsed = data ? JSON.parse(data) : null
    return migrateProgress(parsed)
  } catch {
    return getDefaultProgress()
  }
}

function getDefaultProgress() {
  // Derive first lesson per language (by lowest order) and unlock it by default
  const byLang = {}
  Object.values(lessons).forEach((l) => {
    if (!byLang[l.lang]) byLang[l.lang] = []
    byLang[l.lang].push(l)
  })

  const unlockedSkills = {}
  const completedSkills = {}

  Object.entries(byLang).forEach(([lang, arr]) => {
    // pick lesson with smallest order (fallback to first item)
    const sorted = arr.slice().sort((a, b) => (a.order || 0) - (b.order || 0))
    const first = sorted[0]
    if (first) unlockedSkills[lang] = [first.skill]
    else unlockedSkills[lang] = []

    completedSkills[lang] = []
  })

  const createdAt = nowIso()
  return {
    version: SAVE_VERSION,
    player: {
      id: "guest",
      displayName: "Tarnished",
      xpTotal: 0,
      xpUnspent: 0,
    },
    skills: {
      unlocked: unlockedSkills,
      completed: completedSkills,
    },
    meta: {
      createdAt,
      updatedAt: createdAt,
    },
  }
}

function migrateProgress(parsed) {
  // v2 shape: { version, player, skills:{unlocked, completed}, meta }
  if (parsed && parsed.version === SAVE_VERSION && parsed.skills) {
    // normalize missing fields
    parsed.player = parsed.player || { id: "guest", displayName: "Tarnished", xpTotal: 0, xpUnspent: 0 }
    parsed.player.xpTotal = clampNonNegative(parsed.player.xpTotal)
    parsed.player.xpUnspent = clampNonNegative(parsed.player.xpUnspent)
    parsed.skills.unlocked = parsed.skills.unlocked || {}
    parsed.skills.completed = parsed.skills.completed || {}
    parsed.meta = parsed.meta || { createdAt: nowIso(), updatedAt: nowIso() }
    return parsed
  }

  // v1 shape (current codebase): { unlockedSkills, completedSkills }
  if (parsed && (parsed.unlockedSkills || parsed.completedSkills)) {
    const createdAt = nowIso()
    return {
      version: SAVE_VERSION,
      player: {
        id: "guest",
        displayName: "Tarnished",
        xpTotal: 0,
        xpUnspent: 0,
      },
      skills: {
        unlocked: parsed.unlockedSkills || {},
        completed: parsed.completedSkills || {},
      },
      meta: {
        createdAt,
        updatedAt: createdAt,
      },
    }
  }

  return getDefaultProgress()
}

function setProgress(save) {
  const next = save || getDefaultProgress()
  if (!next.meta) next.meta = { createdAt: nowIso(), updatedAt: nowIso() }
  next.meta.updatedAt = nowIso()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  // Notify in-app subscribers (and keep this decoupled from React).
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bebo_progress'))
    }
  } catch {
    // ignore
  }
}

export function resetProgress() {
  const next = getDefaultProgress()
  setProgress(next)
  return next
}

export function getPlayer() {
  return getProgress().player
}

export function awardXp(amount) {
  const save = getProgress()
  const delta = clampNonNegative(amount)
  save.player.xpTotal = clampNonNegative(save.player.xpTotal + delta)
  save.player.xpUnspent = clampNonNegative(save.player.xpUnspent + delta)
  setProgress(save)
  return save.player
}

export function spendXp(amount) {
  const save = getProgress()
  const cost = clampNonNegative(amount)
  if (save.player.xpUnspent < cost) return { ok: false, error: "Not enough XP" }
  save.player.xpUnspent = clampNonNegative(save.player.xpUnspent - cost)
  setProgress(save)
  return { ok: true, player: save.player }
}

export function isSkillUnlocked(lang, skill) {
  const progress = getProgress()
  return ((progress.skills?.unlocked?.[lang]) || []).includes(skill)
}

export function isSkillCompleted(lang, skill) {
  const progress = getProgress()
  return ((progress.skills?.completed?.[lang]) || []).includes(skill)
}

export function unlockSkill(lang, skill) {
  const progress = getProgress()

  if (!progress.skills) {
    progress.skills = { unlocked: {}, completed: {} }
  }

  if (!progress.skills.unlocked[lang]) {
    progress.skills.unlocked[lang] = []
  }

  if (!progress.skills.unlocked[lang].includes(skill)) {
    progress.skills.unlocked[lang].push(skill)
  }

  setProgress(progress)
}

export function completeSkill(lang, skill) {
  const progress = getProgress()

  if (!progress.skills) {
    progress.skills = { unlocked: {}, completed: {} }
  }

  // Mark as completed
  if (!progress.skills.completed[lang]) {
    progress.skills.completed[lang] = []
  }

  if (!progress.skills.completed[lang].includes(skill)) {
    progress.skills.completed[lang].push(skill)
  }

  setProgress(progress)
}

export function unlockNextSkill(lang, nextSkill) {
  if (nextSkill) {
    unlockSkill(lang, nextSkill)
  }
}
