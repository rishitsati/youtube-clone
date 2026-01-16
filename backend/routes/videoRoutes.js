import express from "express";
import {
  createVideo,
  getAllVideos,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVideos);
router.post("/", protect, createVideo);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);
export default router;
