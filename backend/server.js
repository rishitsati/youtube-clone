
import commentRoutes from "./routes/commentRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);




// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("YouTube Clone API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.send("API running");
  });
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
