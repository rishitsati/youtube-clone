import mongoose from "mongoose";

// Track watch history with timestamps
const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    // How many seconds into the video user watched
    secondsWatched: {
      type: Number,
      default: 0,
    },
    // Total duration of video for percentage watched
    totalDuration: {
      type: Number,
      default: 0,
    },
    // Whether user completed the video (watched >= 90%)
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt = when watch started, updatedAt = last progress
);

export default mongoose.model("WatchHistory", watchHistorySchema);
