import { Router } from "express";
import { get, getStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, get);
router.get("/habits/:id/stats", protect, getStats)

export default router;