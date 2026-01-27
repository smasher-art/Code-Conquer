import lessons from './lessons'

export function getLanguages() {
  // Derive available languages from lessons data
  const map = new Map()
  Object.values(lessons).forEach((l) => {
    if (!map.has(l.lang)) {
      // Friendly label: capitalize
      const label = l.lang.charAt(0).toUpperCase() + l.lang.slice(1)
      map.set(l.lang, {
        slug: l.lang,
        label,
        // primary color for UI (fallback)
        color: l.color || (l.lang === 'javascript' ? '#000' : '#00000020'),
      })
    }
  })

  return Array.from(map.values())
}

export default getLanguages
