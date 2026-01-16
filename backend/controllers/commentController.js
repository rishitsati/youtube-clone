import Comment from "../models/Comment.js";
import User from "../models/User.js";

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { text, videoId, parentCommentId } = req.body;

    if (!text || !videoId) {
      return res
        .status(400)
        .json({ message: "Comment text and video ID are required" });
    }

    // Validate text length (YouTube allows up to 10000 characters)
    if (text.length > 10000) {
      return res
        .status(400)
        .json({ message: "Comment is too long (max 10000 characters)" });
    }

    const comment = await Comment.create({
      text,
      video: videoId,
      user: req.user._id,
      parentComment: parentCommentId || null,
    });

    // Populate user info
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username avatar"
    );

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
        $inc: { engagement: 1 },
      });
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a video
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { sortBy } = req.query;

    // Get top-level comments only (parentComment is null)
    let query = Comment.find({
      video: videoId,
      parentComment: null,
    }).populate("user", "username avatar");

    // Sort
    if (sortBy === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sortBy === "top") {
      query = query.sort({ "likedBy.length": -1, createdAt: -1 });
    } else {
      // Default: newest first
      query = query.sort({ createdAt: -1 });
    }

    const comments = await query;

    // Populate replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
        })
          .populate("user", "username avatar")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single comment with replies
export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("user", "username avatar")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username avatar" },
      });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment (author only)
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 10000) {
      return res
        .status(400)
        .json({ message: "Comment is too long (max 10000 characters)" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author can edit
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text;
    await comment.save();

    // Populate user info
    await comment.populate("user", "username avatar");

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author or video uploader can delete
    const video = await Comment.findById(req.params.id);
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    // If it's a reply, remove from parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
        $inc: { engagement: -1 },
      });
    }

    // Delete all replies if it's a top-level comment
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a comment (prevent duplicates)
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if already liked
    if (comment.likedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked this comment" });
    }

    // Add like
    comment.likedBy.push(req.user._id);
    comment.likes = comment.likedBy.length;
    comment.engagement = (comment.replies?.length || 0) + comment.likes;

    await comment.save();

    // Update user's likedComments
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedComments: comment._id },
    });

    res.json({ likes: comment.likes, engagement: comment.engagement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a comment
export const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.likedBy.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You haven't liked this comment" });
    }

    comment.likedBy.pull(req.user._id);
    comment.likes = comment.likedBy.length;
    comment.engagement = (comment.replies?.length || 0) + comment.likes;

    await comment.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedComments: comment._id },
    });

    res.json({ likes: comment.likes, engagement: comment.engagement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
