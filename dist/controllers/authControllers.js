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
exports.recoverAdminAccount = exports.acceptAdminInvitation = exports.createAdminRecoveryCode = exports.createAdminInvitation = exports.logoutAdmin = exports.getAdminSession = exports.loginAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const crypto_1 = require("crypto");
const customErrors_1 = require("../errors/customErrors");
const adminAccount_1 = __importDefault(require("../models/adminAccount"));
const adminInvitation_1 = __importDefault(require("../models/adminInvitation"));
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
    const session = (0, adminAuth_1.createAdminSession)(account.username, account.authVersion);
    res.setHeader("Set-Cookie", (0, adminAuth_1.adminSessionCookie)(session.value, session.maxAge));
    res.status(http_status_codes_1.StatusCodes.OK).json({ admin: { username: account.username } });
});
exports.loginAdmin = loginAdmin;
const getAdminSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = (0, adminAuth_2.readAdminSession)(req.headers.cookie);
    if (!session)
        throw new customErrors_1.UnauthorizedError("Admin sign-in required");
    const account = yield adminAccount_1.default.findOne({
        username: session.username,
        authVersion: session.authVersion,
    }).select("username");
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
const hashInvitationToken = (token) => (0, crypto_1.createHash)("sha256").update(token).digest("hex");
const createAdminInvitation = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, crypto_1.randomBytes)(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    yield adminInvitation_1.default.create({
        tokenHash: hashInvitationToken(token),
        expiresAt,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        invitation: { token, expiresAt: expiresAt.toISOString() },
    });
});
exports.createAdminInvitation = createAdminInvitation;
const createAdminRecoveryCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof username !== "string" ||
        !/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
        throw new customErrors_1.BadRequestError("Provide a valid admin username");
    }
    const token = (0, crypto_1.randomBytes)(32).toString("hex");
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const account = yield adminAccount_1.default.findOneAndUpdate({ username: username.toLowerCase() }, {
        $set: {
            recoveryCodeHash: hashInvitationToken(token),
            recoveryCodeExpiresAt: expiresAt,
        },
    }, { new: true }).select("username");
    if (!account)
        throw new customErrors_1.BadRequestError("No admin account has that username");
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        recoveryCode: { token, username: account.username, expiresAt },
    });
});
exports.createAdminRecoveryCode = createAdminRecoveryCode;
const acceptAdminInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { token, username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof token !== "string" ||
        !/^[a-f0-9]{64}$/.test(token) ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        !/^[a-zA-Z0-9._-]{3,32}$/.test(username) ||
        password.length < 12 ||
        password.length > 128) {
        throw new customErrors_1.BadRequestError("Use a 3-32 character username and a password of 12-128 characters");
    }
    const tokenHash = hashInvitationToken(token);
    const isInvitationValid = yield adminInvitation_1.default.exists({
        tokenHash,
        expiresAt: { $gt: new Date() },
        usedAt: null,
    });
    if (!isInvitationValid) {
        throw new customErrors_1.BadRequestError("This invitation is invalid, expired, or already used");
    }
    const normalizedUsername = username.toLowerCase();
    const exists = yield adminAccount_1.default.exists({ username: normalizedUsername });
    if (exists)
        throw new customErrors_1.BadRequestError("That username is already in use");
    const invitation = yield adminInvitation_1.default.findOneAndUpdate({
        tokenHash,
        expiresAt: { $gt: new Date() },
        usedAt: null,
    }, { $set: { usedAt: new Date() } }, { new: true });
    if (!invitation) {
        throw new customErrors_1.BadRequestError("This invitation is invalid, expired, or already used");
    }
    yield adminAccount_1.default.create({
        username: normalizedUsername,
        passwordHash: (0, adminAuth_1.hashPassword)(password),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        admin: { username: normalizedUsername },
    });
});
exports.acceptAdminInvitation = acceptAdminInvitation;
const recoverAdminAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { code, username, password } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof code !== "string" ||
        code.length < 1 ||
        code.length > 256 ||
        typeof username !== "string" ||
        !/^[a-zA-Z0-9._-]{3,32}$/.test(username) ||
        typeof password !== "string" ||
        password.length < 12 ||
        password.length > 128) {
        throw new customErrors_1.BadRequestError("Provide a recovery code, a 3-32 character username, and a password of 12-128 characters");
    }
    const normalizedUsername = username.toLowerCase();
    const masterCode = process.env.ADMIN_MASTER_RECOVERY_CODE;
    const matchesMasterCode = masterCode
        ? (0, crypto_1.timingSafeEqual)((0, crypto_1.createHash)("sha256").update(code).digest(), (0, crypto_1.createHash)("sha256").update(masterCode).digest())
        : false;
    if (matchesMasterCode) {
        yield adminAccount_1.default.findOneAndUpdate({ username: normalizedUsername }, {
            $set: { passwordHash: (0, adminAuth_1.hashPassword)(password) },
            $unset: { recoveryCodeHash: 1, recoveryCodeExpiresAt: 1 },
            $inc: { authVersion: 1 },
        }, { new: true, upsert: true });
    }
    else {
        const account = yield adminAccount_1.default.findOneAndUpdate({
            recoveryCodeHash: hashInvitationToken(code),
            recoveryCodeExpiresAt: { $gt: new Date() },
        }, {
            $set: { username: normalizedUsername, passwordHash: (0, adminAuth_1.hashPassword)(password) },
            $unset: { recoveryCodeHash: 1, recoveryCodeExpiresAt: 1 },
            $inc: { authVersion: 1 },
        }, { new: true });
        if (!account)
            throw new customErrors_1.UnauthorizedError("Invalid, expired, or used recovery code");
    }
    res.setHeader("Set-Cookie", (0, adminAuth_1.clearAdminSessionCookie)());
    res.status(http_status_codes_1.StatusCodes.OK).json({
        msg: "Admin credentials recovered. Sign in with the new username and password.",
    });
});
exports.recoverAdminAccount = recoverAdminAccount;
//# sourceMappingURL=authControllers.js.map