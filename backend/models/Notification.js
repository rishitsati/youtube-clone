import mongoose from "mongoose";

// Notifications for new videos from subscribed channels, comments, likes, etc.
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["new_video", "comment", "like", "reply", "subscription"],
      required: true,
    },
    // Reference to the triggering entity
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "refModel", // Dynamic reference
    },
    refModel: {
      type: String,
      enum: ["Video", "Comment", "Channel"],
    },
    // The user who triggered the notification
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
