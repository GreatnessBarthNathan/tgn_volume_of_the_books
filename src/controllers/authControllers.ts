import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { createHash, randomBytes, timingSafeEqual } from "crypto"
import {
  BadRequestError,
  UnauthorizedError,
} from "../errors/customErrors"
import AdminAccount from "../models/adminAccount"
import AdminInvitation from "../models/adminInvitation"
import {
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminSession,
  hashPassword,
  normalizeUsername,
  verifyPassword,
} from "../utils/adminAuth"
import { readAdminSession } from "../utils/adminAuth"

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {}
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !/^[a-zA-Z0-9._-]{3,32}$/.test(normalizeUsername(username)) ||
    password.trim().length < 1 ||
    password.trim().length > 128
  ) {
    throw new BadRequestError("Please provide a username and password")
  }

  const account = await AdminAccount.findOne({
    username: normalizeUsername(username),
  })
  if (!account || !verifyPassword(password, account.passwordHash)) {
    throw new UnauthorizedError("Invalid username or password")
  }

  const session = createAdminSession(account.username, account.authVersion)
  res.setHeader("Set-Cookie", adminSessionCookie(session.value, session.maxAge))
  res.status(StatusCodes.OK).json({ admin: { username: account.username } })
}

export const getAdminSession = async (req: Request, res: Response) => {
  const session = readAdminSession(req.headers.cookie)
  if (!session) throw new UnauthorizedError("Admin sign-in required")

  const account = await AdminAccount.findOne({
    username: session.username,
    authVersion: session.authVersion,
  }).select("username")
  if (!account) throw new UnauthorizedError("Admin sign-in required")

  res.status(StatusCodes.OK).json({ admin: { username: account.username } })
}

export const logoutAdmin = async (_req: Request, res: Response) => {
  res.setHeader("Set-Cookie", clearAdminSessionCookie())
  res.status(StatusCodes.OK).json({ msg: "Signed out" })
}

const hashInvitationToken = (token: string) =>
  createHash("sha256").update(token).digest("hex")

export const createAdminInvitation = async (_req: Request, res: Response) => {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await AdminInvitation.create({
    tokenHash: hashInvitationToken(token),
    expiresAt,
  })

  res.status(StatusCodes.CREATED).json({
    invitation: { token, expiresAt: expiresAt.toISOString() },
  })
}

export const createAdminRecoveryCode = async (req: Request, res: Response) => {
  const { username } = req.body ?? {}
  if (
    typeof username !== "string" ||
    !/^[a-zA-Z0-9._-]{3,32}$/.test(normalizeUsername(username))
  ) {
    throw new BadRequestError("Provide a valid admin username")
  }

  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  const account = await AdminAccount.findOneAndUpdate(
    { username: normalizeUsername(username) },
    {
      $set: {
        recoveryCodeHash: hashInvitationToken(token),
        recoveryCodeExpiresAt: expiresAt,
      },
    },
    { new: true }
  ).select("username")

  if (!account) throw new BadRequestError("No admin account has that username")

  res.status(StatusCodes.CREATED).json({
    recoveryCode: { token, username: account.username, expiresAt },
  })
}

export const acceptAdminInvitation = async (req: Request, res: Response) => {
  const { token, username, password } = req.body ?? {}
  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/.test(token) ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    !/^[a-zA-Z0-9._-]{3,32}$/.test(normalizeUsername(username)) ||
    password.trim().length < 12 ||
    password.trim().length > 128
  ) {
    throw new BadRequestError(
      "Use a 3-32 character username and a password of 12-128 characters"
    )
  }

  const tokenHash = hashInvitationToken(token)
  const isInvitationValid = await AdminInvitation.exists({
    tokenHash,
    expiresAt: { $gt: new Date() },
    usedAt: null,
  })
  if (!isInvitationValid) {
    throw new BadRequestError("This invitation is invalid, expired, or already used")
  }

  const normalizedUsername = normalizeUsername(username)
  const exists = await AdminAccount.exists({ username: normalizedUsername })
  if (exists) throw new BadRequestError("That username is already in use")

  const invitation = await AdminInvitation.findOneAndUpdate(
    {
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null,
    },
    { $set: { usedAt: new Date() } },
    { new: true }
  )
  if (!invitation) {
    throw new BadRequestError("This invitation is invalid, expired, or already used")
  }

  await AdminAccount.create({
    username: normalizedUsername,
    passwordHash: hashPassword(password),
  })
  res.status(StatusCodes.CREATED).json({
    admin: { username: normalizedUsername },
  })
}

export const recoverAdminAccount = async (req: Request, res: Response) => {
  const { code, username, password } = req.body ?? {}

  if (
    typeof code !== "string" ||
    code.length < 1 ||
    code.length > 256 ||
    typeof username !== "string" ||
    !/^[a-zA-Z0-9._-]{3,32}$/.test(normalizeUsername(username)) ||
    typeof password !== "string" ||
    password.trim().length < 12 ||
    password.trim().length > 128
  ) {
    throw new BadRequestError(
      "Provide a recovery code, a 3-32 character username, and a password of 12-128 characters"
    )
  }

  const normalizedUsername = normalizeUsername(username)
  const masterCode = process.env.ADMIN_MASTER_RECOVERY_CODE
  const matchesMasterCode = masterCode
    ? timingSafeEqual(
        createHash("sha256").update(code).digest(),
        createHash("sha256").update(masterCode).digest()
      )
    : false

  if (matchesMasterCode) {
    await AdminAccount.findOneAndUpdate(
      { username: normalizedUsername },
      {
        $set: { passwordHash: hashPassword(password) },
        $unset: { recoveryCodeHash: 1, recoveryCodeExpiresAt: 1 },
        $inc: { authVersion: 1 },
      },
      { new: true, upsert: true }
    )
  } else {
    const account = await AdminAccount.findOneAndUpdate(
      {
        recoveryCodeHash: hashInvitationToken(code),
        recoveryCodeExpiresAt: { $gt: new Date() },
      },
      {
        $set: { username: normalizedUsername, passwordHash: hashPassword(password) },
        $unset: { recoveryCodeHash: 1, recoveryCodeExpiresAt: 1 },
        $inc: { authVersion: 1 },
      },
      { new: true }
    )
    if (!account) throw new UnauthorizedError("Invalid, expired, or used recovery code")
  }

  res.setHeader("Set-Cookie", clearAdminSessionCookie())
  res.status(StatusCodes.OK).json({
    msg: "Admin credentials recovered. Sign in with the new username and password.",
  })
}
