"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const requireAdmin_1 = __importDefault(require("../middleware/requireAdmin"));
const router = (0, express_1.Router)();
router.post("/login", authControllers_1.loginAdmin);
router.get("/session", authControllers_1.getAdminSession);
router.post("/logout", authControllers_1.logoutAdmin);
router.post("/accounts/invitations", requireAdmin_1.default, authControllers_1.createAdminInvitation);
router.post("/accounts/recovery-codes", requireAdmin_1.default, authControllers_1.createAdminRecoveryCode);
router.post("/accounts/accept-invitation", authControllers_1.acceptAdminInvitation);
router.post("/recover", authControllers_1.recoverAdminAccount);
exports.default = router;
//# sourceMappingURL=authRoute.js.map