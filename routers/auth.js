import express from "express";
import { login, refreshToken, register } from "../controllers/auth.js";
import { resetPassword } from "../controllers/user.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

router.post("/changepassword", resetPassword);

export default router;
