import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto"

const SESSION_COOKIE = "admin_session"
const HASH_SALT_BYTES = 16
const HASH_KEY_BYTES = 64

export const normalizeUsername = (username: string) =>
  username.trim().toLowerCase()

const sessionSecret = () => {
  const secret = process.env.AUTH_SESSION_SECRET
  if (!secret) throw new Error("AUTH_SESSION_SECRET must be configured")
  return secret
}

export const hashPassword = (password: string) => {
  const salt = randomBytes(HASH_SALT_BYTES).toString("hex")
  const hash = scryptSync(password.trim(), salt, HASH_KEY_BYTES).toString("hex")
  return `${salt}:${hash}`
}

export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, expectedHash] = storedHash.split(":")
  if (!salt || !expectedHash) return false

  const actualHash = scryptSync(password.trim(), salt, HASH_KEY_BYTES)
  const expected = Buffer.from(expectedHash, "hex")
  return (
    actualHash.length === expected.length &&
    timingSafeEqual(actualHash, expected)
  )
}

const sessionDays = () => {
  const days = Number(process.env.ADMIN_SESSION_DAYS ?? 7)
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("ADMIN_SESSION_DAYS must be an integer between 1 and 365")
  }
  return days
}

export const validateAuthConfig = () => {
  if (sessionSecret().length < 32) {
    throw new Error("AUTH_SESSION_SECRET must be at least 32 characters long")
  }
  sessionDays()
  const username = process.env.ADMIN_USERNAME?.trim()
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured")
  }
  if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
    throw new Error("ADMIN_USERNAME must be 3-32 letters, numbers, '.', '_' or '-'")
  }
  if (
    password.length < 12 ||
    password.length > 128
  ) {
    throw new Error("ADMIN_PASSWORD must be between 12 and 128 characters long")
  }
  if (
    process.env.ADMIN_MASTER_RECOVERY_CODE &&
    process.env.ADMIN_MASTER_RECOVERY_CODE.length < 32
  ) {
    throw new Error(
      "ADMIN_MASTER_RECOVERY_CODE must be at least 32 characters long"
    )
  }
}

const sign = (payload: string) =>
  createHmac("sha256", sessionSecret()).update(payload).digest("base64url")

export const createAdminSession = (username: string, authVersion: number) => {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDays() * 86400
  const payload = Buffer.from(
    JSON.stringify({ username, authVersion, expiresAt })
  ).toString("base64url")
  return {
    value: `${payload}.${sign(payload)}`,
    maxAge: sessionDays() * 86400 * 1000,
  }
}

export const readAdminSession = (cookieHeader?: string) => {
  const sessionCookie = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
  if (!sessionCookie) return null

  const value = sessionCookie.slice(SESSION_COOKIE.length + 1)
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const actual = Buffer.from(signature)
  if (
    expected.length !== actual.length ||
    !timingSafeEqual(expected, actual)
  ) {
    return null
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as {
      username?: unknown
      authVersion?: unknown
      expiresAt?: unknown
    }
    if (
      typeof session.username !== "string" ||
      typeof session.authVersion !== "number" ||
      !Number.isInteger(session.authVersion) ||
      session.authVersion < 0 ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }
    return {
      username: session.username,
      authVersion: session.authVersion,
    }
  } catch {
    return null
  }
}

export const adminSessionCookie = (value: string, maxAge: number) =>
  `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(
    maxAge / 1000
  )}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`

export const clearAdminSessionCookie = () =>
  `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`
