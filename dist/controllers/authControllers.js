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
exports.createAdminAccount = exports.logoutAdmin = exports.getAdminSession = exports.loginAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const adminAccount_1 = __importDefault(require("../models/adminAccount"));
const adminAuth_1 = require("../utils/adminAuth");
const adminAuth_2 = require("../utils/adminAuth");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof username !== "string" ||
        typeof password !== "string" ||
        !/^[a-zA-Z0-9._-]{3,32}$/.test(username) ||
        password.length < 1 ||
        password.length > 128) {
        throw new customErrors_1.BadRequestError("Please provide a username and password");
    }
    const account = yield adminAccount_1.default.findOne({
        username: username.trim().toLowerCase(),
    });
    if (!account || !(0, adminAuth_1.verifyPassword)(password, account.passwordHash)) {
        throw new customErrors_1.UnauthorizedError("Invalid username or password");
    }
    const session = (0, adminAuth_1.createAdminSession)(account.username);
    res.setHeader("Set-Cookie", (0, adminAuth_1.adminSessionCookie)(session.value, session.maxAge));
    res.status(http_status_codes_1.StatusCodes.OK).json({ admin: { username: account.username } });
});
exports.loginAdmin = loginAdmin;
const getAdminSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = (0, adminAuth_2.readAdminSession)(req.headers.cookie);
    if (!username)
        throw new customErrors_1.UnauthorizedError("Admin sign-in required");
    const account = yield adminAccount_1.default.findOne({ username }).select("username");
    if (!account)
        throw new customErrors_1.UnauthorizedError("Admin sign-in required");
    res.status(http_status_codes_1.StatusCodes.OK).json({ admin: { username: account.username } });
});
exports.getAdminSession = getAdminSession;
const logoutAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Set-Cookie", (0, adminAuth_1.clearAdminSessionCookie)());
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Signed out" });
});
exports.logoutAdmin = logoutAdmin;
const createAdminAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof username !== "string" ||
        typeof password !== "string" ||
        !/^[a-zA-Z0-9._-]{3,32}$/.test(username) ||
        password.length < 12 ||
        password.length > 128) {
        throw new customErrors_1.BadRequestError("Use a 3-32 character username and a password of 12-128 characters");
    }
    const normalizedUsername = username.toLowerCase();
    const exists = yield adminAccount_1.default.exists({ username: normalizedUsername });
    if (exists)
        throw new customErrors_1.BadRequestError("That username is already in use");
    yield adminAccount_1.default.create({
        username: normalizedUsername,
        passwordHash: (0, adminAuth_1.hashPassword)(password),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        admin: { username: normalizedUsername },
    });
});
exports.createAdminAccount = createAdminAccount;
//# sourceMappingURL=authControllers.js.map