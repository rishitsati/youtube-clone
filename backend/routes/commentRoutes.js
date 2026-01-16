import express from "express";
import {
  addComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get comments for a video
router.get("/:videoId", getComments);
router.get("/:id", getComment);

// Add comment (protected)
router.post("/", protect, addComment);

// Update/Delete comment (protected)
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

// Like/Unlike comment (protected)
router.put("/:id/like", protect, likeComment);
router.put("/:id/unlike", protect, unlikeComment);

export default router;
