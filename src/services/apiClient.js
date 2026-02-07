const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000"

function getToken() {
  try {
    return localStorage.getItem("bebo_token")
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (!token) localStorage.removeItem("bebo_token")
    else localStorage.setItem("bebo_token", token)
  } catch {
    // ignore
  }
}

export async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}
