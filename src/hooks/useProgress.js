import { useSyncExternalStore } from "react"
import { getProgress } from "@u/progress"

let lastRaw = undefined
let lastSnapshot = undefined

function getSnapshotCached() {
  // useSyncExternalStore requires getSnapshot() to be referentially stable
  // when the underlying store data hasn't changed.
  try {
    const raw = localStorage.getItem("bebo_progress")
    if (raw === lastRaw && lastSnapshot) return lastSnapshot
    lastRaw = raw
    lastSnapshot = getProgress()
    return lastSnapshot
  } catch {
    // Fallback (non-browser). Keep it stable too.
    if (lastSnapshot) return lastSnapshot
    lastSnapshot = getProgress()
    return lastSnapshot
  }
}

function subscribe(callback) {
  const onProgress = () => callback()
  const onStorage = (e) => {
    if (e && e.key && e.key !== "bebo_progress") return
    callback()
  }

  window.addEventListener("bebo_progress", onProgress)
  window.addEventListener("storage", onStorage)

  return () => {
    window.removeEventListener("bebo_progress", onProgress)
    window.removeEventListener("storage", onStorage)
  }
}

export default function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshotCached, getSnapshotCached)
}
