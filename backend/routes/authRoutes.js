import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
