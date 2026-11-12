import { Router } from "express"
import {
  createChapter,
  getChapters,
  singleChapter,
  editChapter,
  deleteChapter,
} from "../controllers/chapterControllers"
import requireAdmin from "../middleware/requireAdmin"

const router = Router()

router.get("/single-chapter/:id", singleChapter)

router.get("/:id", getChapters)

router.post("/", requireAdmin, createChapter)

router.patch("/:id", requireAdmin, editChapter)

router.delete("/:id", requireAdmin, deleteChapter)

export default router
