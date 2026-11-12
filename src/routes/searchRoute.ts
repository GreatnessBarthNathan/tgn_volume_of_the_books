import { Router } from "express"
import { searchArchive } from "../controllers/searchControllers"

const router = Router()

router.get("/", searchArchive)

export default router
