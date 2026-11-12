import { Router } from "express"
import {
  createVerse,
  getVerses,
  singleVerse,
  editVerse,
  deleteVerse,
} from "../controllers/verseControllers"
import requireAdmin from "../middleware/requireAdmin"

const router = Router()

router.get("/single-verse/:id", singleVerse)

router.get("/:id", getVerses)

router.post("/", requireAdmin, createVerse)

router.patch("/:id", requireAdmin, editVerse)

router.delete("/:id", requireAdmin, deleteVerse)

export default router
