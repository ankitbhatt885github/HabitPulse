import { Router } from "express";
import { complete, getHistory } from "../controllers/completion.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/habits/:id/complete", protect, complete);
router.get("/habits/:id/completions", protect, getHistory);

export default router;