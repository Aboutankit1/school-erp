import express from "express";
import { body } from "express-validator";
import {
  registerSchool,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/register-school",
  [
    body("schoolName").notEmpty().withMessage("School name is required"),
    body("schoolEmail").isEmail().withMessage("Valid school email is required"),
    body("adminEmail").isEmail().withMessage("Valid admin email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  registerSchool
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  login
);

router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
