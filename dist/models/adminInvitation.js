"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminInvitationSchema = new mongoose_1.default.Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
    usedAt: {
        type: Date,
        default: null,
    },
});
exports.default = mongoose_1.default.model("AdminInvitation", AdminInvitationSchema);
//# sourceMappingURL=adminInvitation.js.map