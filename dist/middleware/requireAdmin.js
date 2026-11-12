"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("../errors/customErrors");
const adminAuth_1 = require("../utils/adminAuth");
const adminAccount_1 = __importDefault(require("../models/adminAccount"));
const requireAdmin = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = (0, adminAuth_1.readAdminSession)(req.headers.cookie);
    if (!username)
        throw new customErrors_1.UnauthorizedError("Admin sign-in required");
    const account = yield adminAccount_1.default.findOne({ username }).select("_id");
    if (!account)
        throw new customErrors_1.UnauthorizedError("Admin sign-in required");
    next();
});
exports.default = requireAdmin;
//# sourceMappingURL=requireAdmin.js.map