import express from "express"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { createUser, findUserByEmail, findUserById, updateUser } from "./db.js"
import { requireAuth, signToken } from "./auth.js"

function nowIso() {
  return new Date().toISOString()
}

function defaultSave() {
  const t = nowIso()
  return {
    version: 2,
    player: {
      id: "server",
      displayName: "Tarnished",
      xpTotal: 0,
      xpUnspent: 0,
    },
    skills: {
      unlocked: {},
      completed: {},
    },
    inventory: {
      hintTokens: 0,
    },
    hintsRevealed: {},
    meta: { createdAt: t, updatedAt: t },
  }
}

export default function buildApiRouter() {
  const router = express.Router()

  router.post("/auth/signup", async (req, res) => {
    const { email, password, displayName } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" })

    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await findUserByEmail(normalizedEmail)
    if (existing) return res.status(409).json({ error: "Email already in use" })

    const passwordHash = await bcrypt.hash(String(password), 10)
    const id = crypto.randomUUID()

    const user = {
      id,
      email: normalizedEmail,
      displayName: (displayName && String(displayName).trim()) || "Tarnished",
      passwordHash,
      save: defaultSave(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    await createUser(user)
    const token = signToken(user.id)
    res.json({ token })
  })

  router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" })

    const user = await findUserByEmail(String(email).trim().toLowerCase())
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) return res.status(401).json({ error: "Invalid credentials" })

    const token = signToken(user.id)
    res.json({ token })
  })

  router.get("/me", requireAuth, async (req, res) => {
    const user = await findUserById(req.userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  })

  router.put("/me", requireAuth, async (req, res) => {
    const { displayName } = req.body || {}
    const next = await updateUser(req.userId, {
      displayName: (displayName && String(displayName).trim()) || "Tarnished",
      updatedAt: nowIso(),
    })

    if (!next) return res.status(404).json({ error: "User not found" })
    res.json({ ok: true })
  })

  router.get("/me/progress", requireAuth, async (req, res) => {
    const user = await findUserById(req.userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    res.json({ save: user.save || defaultSave() })
  })

  router.put("/me/progress", requireAuth, async (req, res) => {
    const { save } = req.body || {}
    if (!save || typeof save !== "object") return res.status(400).json({ error: "Missing save" })

    const user = await updateUser(req.userId, {
      save,
      updatedAt: nowIso(),
    })

    if (!user) return res.status(404).json({ error: "User not found" })
    res.json({ ok: true })
  })

  return router
}
