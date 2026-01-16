import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelAvatar, channelBanner } =
      req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Check if channel name is unique
    const existingChannel = await Channel.findOne({ channelName });
    if (existingChannel) {
      return res
        .status(400)
        .json({ message: "Channel name already exists" });
    }

    // Create channel
    const channel = await Channel.create({
      channelName,
      description,
      owner: req.user._id,
      channelAvatar: channelAvatar || "",
      channelBanner: channelBanner || "",
    });

    // Add channel to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a channel by ID
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate("subscribersList", "username avatar")
      .populate({
        path: "videos",
        populate: { path: "uploader", select: "username" },
      });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get channel videos
export const getChannelVideos = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: req.params.id })
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update channel (owner only)
export const updateChannel = async (req, res) => {
  try {
    const { description, channelBanner, channelAvatar } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only owner can edit
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this channel" });
    }

    // Update fields
    if (description !== undefined) channel.description = description;
    if (channelBanner) channel.channelBanner = channelBanner;
    if (channelAvatar) channel.channelAvatar = channelAvatar;

    await channel.save();

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscribe to channel (prevent duplicates)
export const subscribeChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if already subscribed
    if (channel.subscribersList.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Already subscribed to this channel" });
    }

    // Prevent subscribing to own channel
    if (channel.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot subscribe to your own channel" });
    }

    // Add subscriber
    channel.subscribersList.push(req.user._id);
    channel.subscribers = channel.subscribersList.length;

    await channel.save();

    // Add to user's subscriptions
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { subscriptions: channel._id },
    });

    res.json({
      subscribers: channel.subscribers,
      message: "Subscribed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsubscribe from channel
export const unsubscribeChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.subscribersList.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Not subscribed to this channel" });
    }

    // Remove subscriber
    channel.subscribersList.pull(req.user._id);
    channel.subscribers = channel.subscribersList.length;

    await channel.save();

    // Remove from user's subscriptions
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { subscriptions: channel._id },
    });

    res.json({
      subscribers: channel.subscribers,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subscribers
export const getSubscribers = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate(
      "subscribersList",
      "username avatar email"
    );

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel.subscribersList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's channels
export const getUserChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id }).populate(
      "videos"
    );

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user is subscribed
export const checkSubscription = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isSubscribed = channel.subscribersList.includes(req.user._id);

    res.json({ isSubscribed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
