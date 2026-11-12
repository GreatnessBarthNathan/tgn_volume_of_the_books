import { RequestHandler } from "express"
import { UnauthorizedError } from "../errors/customErrors"
import { readAdminSession } from "../utils/adminAuth"
import AdminAccount from "../models/adminAccount"

const requireAdmin: RequestHandler = async (req, _res, next) => {
  const session = readAdminSession(req.headers.cookie)
  if (!session) throw new UnauthorizedError("Admin sign-in required")

  const account = await AdminAccount.findOne({
    username: session.username,
    authVersion: session.authVersion,
  }).select("_id")
  if (!account) throw new UnauthorizedError("Admin sign-in required")

  next()
}

export default requireAdmin
