import lessons from './lessons'

export function getLanguages() {
  // Derive available languages from lessons data
  const map = new Map()

  // First pass: create base language entries
  Object.values(lessons).forEach((l) => {
    if (!map.has(l.lang)) {
      const label = l.lang.charAt(0).toUpperCase() + l.lang.slice(1)
      map.set(l.lang, {
        slug: l.lang,
        label,
        color: l.color || (l.lang === 'javascript' ? '#000' : '#00000020'),
        parent: null,
      })
    }
  })

  // Second pass: detect parent relationships if any lesson provides a parent
  Object.values(lessons).forEach((l) => {
    if (l.parent && map.has(l.lang)) {
      const entry = map.get(l.lang)
      entry.parent = l.parent
      map.set(l.lang, entry)
    }
  })

  return Array.from(map.values())
}

export default getLanguages
