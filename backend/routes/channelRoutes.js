import express from "express";
import {
  createChannel,
  getChannel,
  getChannelVideos,
  updateChannel,
  subscribeChannel,
  unsubscribeChannel,
  getSubscribers,
  getUserChannels,
  checkSubscription,
} from "../controllers/channelController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// User's channels
router.get("/user/my-channels", protect, getUserChannels);

// Public routes
router.get("/:id", getChannel);
router.get("/:id/videos", getChannelVideos);
router.get("/:id/subscribers", getSubscribers);
router.get("/:id/is-subscribed", protect, checkSubscription);

// Protected routes
router.post("/", protect, createChannel);
router.put("/:id", protect, updateChannel);

// Subscribe/Unsubscribe
router.post("/:id/subscribe", protect, subscribeChannel);
router.delete("/:id/subscribe", protect, unsubscribeChannel);

export default router;
