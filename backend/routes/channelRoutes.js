import express from "express";
import { createChannel, getChannel } from "../controllers/channelController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users can create channels
router.post("/", protect, createChannel);

// Anyone can view a channel
router.get("/:id", getChannel);

export default router;
