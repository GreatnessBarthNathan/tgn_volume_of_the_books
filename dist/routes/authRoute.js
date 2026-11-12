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
router.post("/accounts", requireAdmin_1.default, authControllers_1.createAdminAccount);
exports.default = router;
//# sourceMappingURL=authRoute.js.map