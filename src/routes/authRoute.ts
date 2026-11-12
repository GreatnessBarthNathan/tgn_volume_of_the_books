import { Router } from "express"
import {
  acceptAdminInvitation,
  createAdminRecoveryCode,
  createAdminInvitation,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  recoverAdminAccount,
} from "../controllers/authControllers"
import requireAdmin from "../middleware/requireAdmin"

const router = Router()

router.post("/login", loginAdmin)
router.get("/session", getAdminSession)
router.post("/logout", logoutAdmin)
router.post("/accounts/invitations", requireAdmin, createAdminInvitation)
router.post("/accounts/recovery-codes", requireAdmin, createAdminRecoveryCode)
router.post("/accounts/accept-invitation", acceptAdminInvitation)
router.post("/recover", recoverAdminAccount)

export default router
