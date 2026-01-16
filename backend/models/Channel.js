import mongoose from "mongoose";

// This represents a YouTube channel
const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    channelBanner: {
      type: String,
      default: "",
    },
    channelAvatar: {
      type: String,
      default: "",
    },
    // Track actual subscribers (users) instead of just count
    subscribersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Denormalized count for quick access
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
