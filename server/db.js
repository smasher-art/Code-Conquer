import fs from "fs/promises"
import path from "path"

const DB_PATH = path.resolve(process.cwd(), "server", "data", "db.json")

async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf8")
  const parsed = JSON.parse(raw)
  if (!parsed.users) parsed.users = []
  return parsed
}

async function writeDb(db) {
  const next = db || { users: [] }
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2) + "\n", "utf8")
}

export async function findUserByEmail(email) {
  const db = await readDb()
  return db.users.find((u) => u.email === email) || null
}

export async function findUserById(id) {
  const db = await readDb()
  return db.users.find((u) => u.id === id) || null
}

export async function createUser(user) {
  const db = await readDb()
  db.users.push(user)
  await writeDb(db)
  return user
}

export async function updateUser(id, patch) {
  const db = await readDb()
  const idx = db.users.findIndex((u) => u.id === id)
  if (idx < 0) return null
  db.users[idx] = { ...db.users[idx], ...patch }
  await writeDb(db)
  return db.users[idx]
}
