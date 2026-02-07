import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export function signToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: "30d" })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ""
  const [kind, token] = header.split(" ")
  if (kind !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing auth token" })
  }

  try {
    const payload = jwt.verify(token, SECRET)
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: "Invalid auth token" })
  }
}
