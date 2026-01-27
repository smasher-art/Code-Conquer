// localStorage utility for tracking progress

import lessons from "./lessons"

const STORAGE_KEY = "bebo_progress"

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : getDefaultProgress()
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

  return {
    unlockedSkills,
    completedSkills,
  }
}

export function isSkillUnlocked(lang, skill) {
  const progress = getProgress()
  return (progress.unlockedSkills[lang] || []).includes(skill)
}

export function isSkillCompleted(lang, skill) {
  const progress = getProgress()
  return (progress.completedSkills[lang] || []).includes(skill)
}

export function unlockSkill(lang, skill) {
  const progress = getProgress()

  if (!progress.unlockedSkills[lang]) {
    progress.unlockedSkills[lang] = []
  }

  if (!progress.unlockedSkills[lang].includes(skill)) {
    progress.unlockedSkills[lang].push(skill)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function completeSkill(lang, skill) {
  const progress = getProgress()

  // Mark as completed
  if (!progress.completedSkills[lang]) {
    progress.completedSkills[lang] = []
  }

  if (!progress.completedSkills[lang].includes(skill)) {
    progress.completedSkills[lang].push(skill)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function unlockNextSkill(lang, nextSkill) {
  if (nextSkill) {
    unlockSkill(lang, nextSkill)
  }
}
