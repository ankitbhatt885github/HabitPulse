import { Router } from "express";
import { register, login, getMe} from "../controllers/auth.controller.js";
import {protect} from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../utils/validation.js";

const router = Router();

//calls the register controller, which further calls the service function
router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", protect, getMe);

export default router;