import Playlist from "../models/Playlist.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlist = await Playlist.create({
      name,
      description: description || "",
      owner: req.user._id,
      isPublic: isPublic || false,
    });

    // Add to user's playlists
    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id },
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's playlists
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate("videos", "title thumbnailUrl")
      .select("name description videos thumbnail isPublic createdAt");

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get playlist details
export const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate({
        path: "videos",
        populate: { path: "channel", select: "channelName" },
      })
      .populate("owner", "username avatar");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if public or owner
    if (
      !playlist.isPublic &&
      playlist.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "This playlist is private" });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update playlist (owner only)
export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only owner can edit
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this playlist" });
    }

    // Update fields
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete playlist (owner only)
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only owner can delete
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this playlist" });
    }

    // Remove from user
    await User.findByIdAndUpdate(playlist.owner, {
      $pull: { playlists: playlist._id },
    });

    // Delete playlist
    await playlist.deleteOne();

    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add video to playlist
export const addVideoToPlaylist = async (req, res) => {
  try {
    const { videoId } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only owner can add
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this playlist" });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if video already in playlist
    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ message: "Video already in playlist" });
    }

    // Add video
    playlist.videos.push(videoId);

    // Set thumbnail from first video
    if (playlist.videos.length === 1) {
      playlist.thumbnail = video.thumbnailUrl;
    }

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove video from playlist
export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { videoId } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Only owner can remove
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this playlist" });
    }

    // Remove video
    playlist.videos.pull(videoId);

    // Update thumbnail if needed
    if (playlist.videos.length === 0) {
      playlist.thumbnail = "";
    } else if (playlist.thumbnail) {
      // Keep existing thumbnail, it won't change
    }

    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
