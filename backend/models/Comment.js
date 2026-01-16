import mongoose from "mongoose";

// Each comment belongs to a video and a user
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For nested replies
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    // Store replies as array of comment IDs
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    // Track who liked this comment
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Denormalized like count
    likes: {
      type: Number,
      default: 0,
    },
    // For sorting (YouTube uses this for algorithm)
    engagement: {
      type: Number,
      default: 0, // likes + replies
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
