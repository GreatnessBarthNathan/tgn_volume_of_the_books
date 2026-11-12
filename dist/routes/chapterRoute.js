"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapterControllers_1 = require("../controllers/chapterControllers");
const requireAdmin_1 = __importDefault(require("../middleware/requireAdmin"));
const router = (0, express_1.Router)();
router.get("/single-chapter/:id", chapterControllers_1.singleChapter);
router.get("/:id", chapterControllers_1.getChapters);
router.post("/", requireAdmin_1.default, chapterControllers_1.createChapter);
router.patch("/:id", requireAdmin_1.default, chapterControllers_1.editChapter);
router.delete("/:id", requireAdmin_1.default, chapterControllers_1.deleteChapter);
exports.default = router;
//# sourceMappingURL=chapterRoute.js.map