"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAdminSessionCookie = exports.adminSessionCookie = exports.readAdminSession = exports.createAdminSession = exports.validateAuthConfig = exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = require("crypto");
const SESSION_COOKIE = "admin_session";
const HASH_SALT_BYTES = 16;
const HASH_KEY_BYTES = 64;
const sessionSecret = () => {
    const secret = process.env.AUTH_SESSION_SECRET;
    if (!secret)
        throw new Error("AUTH_SESSION_SECRET must be configured");
    return secret;
};
const hashPassword = (password) => {
    const salt = (0, crypto_1.randomBytes)(HASH_SALT_BYTES).toString("hex");
    const hash = (0, crypto_1.scryptSync)(password, salt, HASH_KEY_BYTES).toString("hex");
    return `${salt}:${hash}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = (password, storedHash) => {
    const [salt, expectedHash] = storedHash.split(":");
    if (!salt || !expectedHash)
        return false;
    const actualHash = (0, crypto_1.scryptSync)(password, salt, HASH_KEY_BYTES);
    const expected = Buffer.from(expectedHash, "hex");
    return (actualHash.length === expected.length &&
        (0, crypto_1.timingSafeEqual)(actualHash, expected));
};
exports.verifyPassword = verifyPassword;
const sessionDays = () => {
    var _a;
    const days = Number((_a = process.env.ADMIN_SESSION_DAYS) !== null && _a !== void 0 ? _a : 7);
    if (!Number.isInteger(days) || days < 1 || days > 365) {
        throw new Error("ADMIN_SESSION_DAYS must be an integer between 1 and 365");
    }
    return days;
};
const validateAuthConfig = () => {
    if (sessionSecret().length < 32) {
        throw new Error("AUTH_SESSION_SECRET must be at least 32 characters long");
    }
    sessionDays();
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured");
    }
    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(process.env.ADMIN_USERNAME)) {
        throw new Error("ADMIN_USERNAME must be 3-32 letters, numbers, '.', '_' or '-'");
    }
    if (process.env.ADMIN_PASSWORD.length < 12 ||
        process.env.ADMIN_PASSWORD.length > 128) {
        throw new Error("ADMIN_PASSWORD must be between 12 and 128 characters long");
    }
    if (process.env.ADMIN_MASTER_RECOVERY_CODE &&
        process.env.ADMIN_MASTER_RECOVERY_CODE.length < 32) {
        throw new Error("ADMIN_MASTER_RECOVERY_CODE must be at least 32 characters long");
    }
};
exports.validateAuthConfig = validateAuthConfig;
const sign = (payload) => (0, crypto_1.createHmac)("sha256", sessionSecret()).update(payload).digest("base64url");
const createAdminSession = (username, authVersion) => {
    const expiresAt = Math.floor(Date.now() / 1000) + sessionDays() * 86400;
    const payload = Buffer.from(JSON.stringify({ username, authVersion, expiresAt })).toString("base64url");
    return {
        value: `${payload}.${sign(payload)}`,
        maxAge: sessionDays() * 86400 * 1000,
    };
};
exports.createAdminSession = createAdminSession;
const readAdminSession = (cookieHeader) => {
    const sessionCookie = cookieHeader === null || cookieHeader === void 0 ? void 0 : cookieHeader.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
    if (!sessionCookie)
        return null;
    const value = sessionCookie.slice(SESSION_COOKIE.length + 1);
    const [payload, signature] = value.split(".");
    if (!payload || !signature)
        return null;
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length ||
        !(0, crypto_1.timingSafeEqual)(expected, actual)) {
        return null;
    }
    try {
        const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (typeof session.username !== "string" ||
            typeof session.authVersion !== "number" ||
            !Number.isInteger(session.authVersion) ||
            session.authVersion < 0 ||
            typeof session.expiresAt !== "number" ||
            session.expiresAt <= Math.floor(Date.now() / 1000)) {
            return null;
        }
        return {
            username: session.username,
            authVersion: session.authVersion,
        };
    }
    catch (_a) {
        return null;
    }
};
exports.readAdminSession = readAdminSession;
const adminSessionCookie = (value, maxAge) => `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(maxAge / 1000)}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
exports.adminSessionCookie = adminSessionCookie;
const clearAdminSessionCookie = () => `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
exports.clearAdminSessionCookie = clearAdminSessionCookie;
//# sourceMappingURL=adminAuth.js.map