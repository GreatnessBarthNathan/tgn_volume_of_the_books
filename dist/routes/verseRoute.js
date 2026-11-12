"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verseControllers_1 = require("../controllers/verseControllers");
const requireAdmin_1 = __importDefault(require("../middleware/requireAdmin"));
const router = (0, express_1.Router)();
router.get("/single-verse/:id", verseControllers_1.singleVerse);
router.get("/:id", verseControllers_1.getVerses);
router.post("/", requireAdmin_1.default, verseControllers_1.createVerse);
router.patch("/:id", requireAdmin_1.default, verseControllers_1.editVerse);
router.delete("/:id", requireAdmin_1.default, verseControllers_1.deleteVerse);
exports.default = router;
//# sourceMappingURL=verseRoute.js.map