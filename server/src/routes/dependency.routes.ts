import { Router } from "express";
import { create, getAll, remove } from "../controllers/dependency.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/habits/:id/dependencies",
  protect,
  create
);
router.get("/habits/:id/dependencies", protect, getAll);
router.delete("/habits/:id/dependencies/:dependencyId",protect,remove)

export default router;