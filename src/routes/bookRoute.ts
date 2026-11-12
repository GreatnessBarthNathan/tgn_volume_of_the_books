import { Router } from "express"
import {
  createBook,
  getBooks,
  singleBook,
  editBook,
  deleteBook,
} from "../controllers/bookControllers"
import requireAdmin from "../middleware/requireAdmin"

const router = Router()

router.get("/", getBooks)

router.get("/:id", singleBook)

router.post("/", requireAdmin, createBook)

router.patch("/:id", requireAdmin, editBook)

router.delete("/:id", requireAdmin, deleteBook)

export default router
