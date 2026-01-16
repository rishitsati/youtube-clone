import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// User's playlists
router.get("/user/my-playlists", protect, getUserPlaylists);

// Get playlist details
router.get("/:id", protect, getPlaylist);

// Create playlist (protected)
router.post("/", protect, createPlaylist);

// Update/Delete playlist (protected)
router.put("/:id", protect, updatePlaylist);
router.delete("/:id", protect, deletePlaylist);

// Add/Remove videos (protected)
router.post("/:id/videos", protect, addVideoToPlaylist);
router.delete("/:id/videos", protect, removeVideoFromPlaylist);

export default router;
