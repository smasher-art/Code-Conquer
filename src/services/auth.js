import { apiFetch, setToken } from "./apiClient"

export async function signup({ email, password, displayName }) {
  const data = await apiFetch("/api/auth/signup", {
    method: "POST",
    auth: false,
    body: { email, password, displayName },
  })
  setToken(data.token)
  return data
}

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  })
  setToken(data.token)
  return data
}

export async function getMe() {
  return apiFetch("/api/me")
}

export function logout() {
  setToken(null)
}
