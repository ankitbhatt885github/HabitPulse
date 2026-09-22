import {Router} from "express"
import {create, getAll, getOne, update, remove} from "../controllers/habit.controller.js"
import {protect} from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js";
import {
  createHabitSchema,
  updateHabitSchema,
} from "../utils/validation.js";

const router = Router();

router.post("/", protect, validate(createHabitSchema), create);
router.get("/", protect, getAll);
router.get("/:id",protect,getOne);
router.put("/:id", protect, validate(updateHabitSchema), update);
router.delete("/:id",protect,remove)


export default router;