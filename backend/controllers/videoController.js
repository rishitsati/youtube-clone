import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import WatchHistory from "../models/WatchHistory.js";

// Upload a new video
export const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      channelId,
      tags,
    } = req.body;

    if (!title || !category || !channelId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle file uploads
    let videoUrl = req.body.videoUrl;
    let thumbnailUrl = req.body.thumbnailUrl;

    if (req.files) {
      if (req.files.video) {
        videoUrl = `/uploads/${req.user._id}/${req.files.video[0].filename}`;
      }
      if (req.files.thumbnail) {
        thumbnailUrl = `/uploads/${req.user._id}/${req.files.thumbnail[0].filename}`;
      }
    }

    if (!videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: "Video and thumbnail are required" });
    }

    // Verify user owns this channel
    const channel = await Channel.findById(channelId);
    if (!channel || channel.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to upload to this channel" });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel: channelId,
      uploader: req.user._id,
      duration: 0,
      tags: tags || [],
    });

    // Add video to channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id },
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all videos (with filters)
export const getAllVideos = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let videos = Video.find(query).populate(
      "channel",
      "channelName channelAvatar"
    );

    // Sort
    if (sortBy === "newest") {
      videos = videos.sort({ createdAt: -1 });
    } else if (sortBy === "views") {
      videos = videos.sort({ views: -1 });
    } else if (sortBy === "trending") {
      // Videos with most engagement (views + likes)
      videos = videos.sort({ views: -1, "likedBy.length": -1 });
    }

    const result = await videos;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single video
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName channelAvatar subscribers owner")
      .populate("uploader", "username avatar")
      .populate({
        path: "likedBy",
        select: "_id",
      });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update video (metadata only, owner only)
export const updateVideo = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only owner can edit
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this video" });
    }

    // Update fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (category) video.category = category;
    if (tags) video.tags = tags;

    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only owner can delete
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this video" });
    }

    // Remove video from channel
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    // Delete video
    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a video (prevent duplicates)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if user already liked
    if (video.likedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked this video" });
    }

    // Remove from disliked if exists
    if (video.dislikedBy.includes(req.user._id)) {
      video.dislikedBy.pull(req.user._id);
      video.dislikes = Math.max(0, video.dislikes - 1);
    }

    // Add to likes
    video.likedBy.push(req.user._id);
    video.likes = video.likedBy.length;

    await video.save();

    // Update user's likedVideos
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedVideos: video._id },
      $pull: { dislikedVideos: video._id },
    });

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a video
export const unlikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!video.likedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You haven't liked this video" });
    }

    video.likedBy.pull(req.user._id);
    video.likes = video.likedBy.length;

    await video.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedVideos: video._id },
    });

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a video (prevent duplicates)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if user already disliked
    if (video.dislikedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Already disliked this video" });
    }

    // Remove from liked if exists
    if (video.likedBy.includes(req.user._id)) {
      video.likedBy.pull(req.user._id);
      video.likes = video.likedBy.length;
    }

    // Add to dislikes
    video.dislikedBy.push(req.user._id);
    video.dislikes = video.dislikedBy.length;

    await video.save();

    // Update user's dislikedVideos
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { dislikedVideos: video._id },
      $pull: { likedVideos: video._id },
    });

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove dislike
export const undislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!video.dislikedBy.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You haven't disliked this video" });
    }

    video.dislikedBy.pull(req.user._id);
    video.dislikes = video.dislikedBy.length;

    await video.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { dislikedVideos: video._id },
    });

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add view (increment views)
export const addView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.views += 1;
    await video.save();

    res.json({ views: video.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track watch history
export const trackWatch = async (req, res) => {
  try {
    const { secondsWatched, totalDuration } = req.body;

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if user already has watch history for this video
    let watchRecord = await WatchHistory.findOne({
      user: req.user._id,
      video: req.params.id,
    });

    // Calculate if video was completed (90% watched)
    const percentageWatched =
      totalDuration > 0 ? (secondsWatched / totalDuration) * 100 : 0;
    const completed = percentageWatched >= 90;

    if (!watchRecord) {
      // Create new watch history
      watchRecord = await WatchHistory.create({
        user: req.user._id,
        video: req.params.id,
        secondsWatched,
        totalDuration,
        completed,
      });

      // Add to user's watch history
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: watchRecord._id },
      });

      // Increment views only on first watch
      video.views += 1;
      await video.save();
    } else {
      // Update existing watch record
      watchRecord.secondsWatched = Math.max(
        watchRecord.secondsWatched,
        secondsWatched
      );
      watchRecord.totalDuration = totalDuration;
      watchRecord.completed = completed;
      await watchRecord.save();
    }

    res.json(watchRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's watch history
export const getWatchHistory = async (req, res) => {
  try {
    const watchHistory = await WatchHistory.find({
      user: req.user._id,
    })
      .populate({
        path: "video",
        populate: { path: "channel", select: "channelName" },
      })
      .sort({ updatedAt: -1 });

    res.json(watchHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear watch history
export const clearWatchHistory = async (req, res) => {
  try {
    // Delete all watch history records for user
    await WatchHistory.deleteMany({ user: req.user._id });

    // Clear from user
    await User.findByIdAndUpdate(req.user._id, {
      watchHistory: [],
    });

    res.json({ message: "Watch history cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get video suggestions (for search bar)
export const getSuggestions = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const suggestions = await Video.find({
      title: { $regex: query, $options: "i" },
    })
      .select("title")
      .limit(10)
      .lean();

    // Extract just the titles
    const titles = suggestions.map((v) => v.title);

    res.json(titles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
