import { resetProgress } from "@u/progress"

// Minimal helper: replace local save with server save.
// Keeps versioning responsibility in progress.js migrations.
export function setProgressFromServer(save) {
  try {
    localStorage.setItem("bebo_progress", JSON.stringify(save))
    window.dispatchEvent(new CustomEvent("bebo_progress"))
  } catch {
    // If storage fails, at least reset to a valid local shape.
    resetProgress()
  }
}
