import express from "express";
import { login, register, getUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js"

const router = express.Router();

router.post('/login', login);
router.get('/getUser', authMiddleware, getUser);
router.post('/register', register);

export default router;