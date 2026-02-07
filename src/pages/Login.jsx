import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { login } from "@/services/auth"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  return (
    <section className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Return to the Shrine</h1>
        <p className="text-white/60 mt-2 text-sm">Login to sync your progress.</p>

        {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

        <div className="mt-6 space-y-3">
          <label className="block">
            <div className="text-xs text-white/60 mb-1">Email</div>
            <input
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <div className="text-xs text-white/60 mb-1">Password</div>
            <input
              className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button
            className="w-full mt-2 rounded-lg bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-50"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              setError(null)
              try {
                await login({ email, password })
                navigate("/profile")
              } catch (e) {
                setError(String(e.message || e))
              } finally {
                setBusy(false)
              }
            }}
          >
            {busy ? "Entering..." : "Login"}
          </button>

          <p className="text-xs text-white/60">
            No account? <NavLink className="underline" to="/signup">Create one</NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}
