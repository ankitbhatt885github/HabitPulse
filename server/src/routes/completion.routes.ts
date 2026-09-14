import { Router } from "express";
import { complete } from "../controllers/completion.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/habits/:id/complete", protect, complete);

export default router;