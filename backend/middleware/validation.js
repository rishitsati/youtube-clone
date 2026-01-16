// Input validation middleware
export const validateVideoUpload = (req, res, next) => {
  const { title, videoUrl, thumbnailUrl, category, channelId } = req.body;

  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (title && title.length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  if (!videoUrl || videoUrl.trim().length === 0) {
    errors.push("Video URL is required");
  }

  if (!thumbnailUrl || thumbnailUrl.trim().length === 0) {
    errors.push("Thumbnail URL is required");
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (!channelId || channelId.trim().length === 0) {
    errors.push("Channel ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

export const validateComment = (req, res, next) => {
  const { text, videoId } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  if (text.length > 10000) {
    return res
      .status(400)
      .json({ message: "Comment cannot exceed 10000 characters" });
  }

  if (!videoId || videoId.trim().length === 0) {
    return res.status(400).json({ message: "Video ID is required" });
  }

  next();
};

export const validateChannelCreate = (req, res, next) => {
  const { channelName } = req.body;

  if (!channelName || channelName.trim().length === 0) {
    return res.status(400).json({ message: "Channel name is required" });
  }

  if (channelName.length > 50) {
    return res
      .status(400)
      .json({ message: "Channel name cannot exceed 50 characters" });
  }

  next();
};

export const validatePlaylistCreate = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  if (name.length > 100) {
    return res
      .status(400)
      .json({ message: "Playlist name cannot exceed 100 characters" });
  }

  next();
};
