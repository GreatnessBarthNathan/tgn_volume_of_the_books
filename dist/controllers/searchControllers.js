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
exports.searchArchive = void 0;
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const chapter_1 = __importDefault(require("../models/chapter"));
const verse_1 = __importDefault(require("../models/verse"));
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const searchArchive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query || query.length > 100) {
        throw new customErrors_1.BadRequestError("Search text must be between 1 and 100 characters");
    }
    const pattern = new RegExp(escapeRegex(query), "i");
    const [chapters, verses] = yield Promise.all([
        chapter_1.default.find({
            $or: [{ name: pattern }, { word: pattern }, { declaration: pattern }],
        })
            .select("name word declaration book date")
            .sort({ book: -1, date: -1 })
            .limit(30)
            .lean(),
        verse_1.default.find({ prophecy: pattern })
            .select("prophecy book chapter date")
            .sort({ book: -1, date: -1 })
            .limit(30)
            .lean(),
    ]);
    res.status(http_status_codes_1.StatusCodes.OK).json({ chapters, verses });
});
exports.searchArchive = searchArchive;
//# sourceMappingURL=searchControllers.js.map