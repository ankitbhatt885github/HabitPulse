import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

//calls the register controller, which further calls the service function
router.post("/register", register);

router.post("/login", login);

export default router;