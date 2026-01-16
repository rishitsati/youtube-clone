

import commentRoutes from "./routes/commentRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/playlists", playlistRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("YouTube Clone API is running");
});

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
