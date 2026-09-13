import {Router} from "express"
import {create, getAll, getOne} from "../controllers/habit.controller.js"
import {protect} from "../middleware/auth.middleware.js"

const router = Router();

router.post("/", protect, create);
router.get("/", protect, getAll);
router.get("/:id",protect,getOne);


export default router;