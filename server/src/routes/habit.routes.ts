import {Router} from "express"
import {create} from "../controllers/habit.controller.js"
import {protect} from "../middleware/auth.middleware.js"

const router = Router();

router.post("/", protect, create);

export default router;