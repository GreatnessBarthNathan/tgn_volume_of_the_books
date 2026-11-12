"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookControllers_1 = require("../controllers/bookControllers");
const requireAdmin_1 = __importDefault(require("../middleware/requireAdmin"));
const router = (0, express_1.Router)();
router.get("/", bookControllers_1.getBooks);
router.get("/:id", bookControllers_1.singleBook);
router.post("/", requireAdmin_1.default, bookControllers_1.createBook);
router.patch("/:id", requireAdmin_1.default, bookControllers_1.editBook);
router.delete("/:id", requireAdmin_1.default, bookControllers_1.deleteBook);
exports.default = router;
//# sourceMappingURL=bookRoute.js.map