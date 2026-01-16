import mongoose from "mongoose";

// Playlists allow users to organize videos
const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    isPublic: {
      type: Boolean,
      default: false, // Private by default
    },
    thumbnail: {
      type: String,
      default: "", // Thumbnail of first video
    },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
