import express from "express";
import {
  addView,
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  dislikeVideo,
  undislikeVideo,
  trackWatch,
  getWatchHistory,
  clearWatchHistory,
  getSuggestions,
} from "../controllers/videoController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllVideos);
router.get("/suggest/:query", getSuggestions);
router.get("/:id", getVideo);

// Protected routes
router.post(
  "/",
  protect,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

// Like/Dislike routes
router.put("/:id/like", protect, likeVideo);
router.put("/:id/unlike", protect, unlikeVideo);
router.put("/:id/dislike", protect, dislikeVideo);
router.put("/:id/undislike", protect, undislikeVideo);

// View routes
router.put("/:id/view", addView);
router.post("/:id/watch", protect, trackWatch);

// Watch history routes
router.get("/watch-history", protect, getWatchHistory);
router.delete("/watch-history/clear", protect, clearWatchHistory);

export default router;
