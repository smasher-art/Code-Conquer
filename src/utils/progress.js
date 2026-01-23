// localStorage utility for tracking progress

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
  return {
    unlockedSkills: {
      javascript: ["variables"],
    },
    completedSkills: {
      javascript: [],
    },
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
