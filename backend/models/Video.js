import mongoose from "mongoose";

// This stores all information about a video
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    // Track users who liked
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Track users who disliked
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Track who watched (for accurate like count)
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
