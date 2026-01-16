import Channel from "../models/Channel.js";
import User from "../models/User.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Create channel
    const channel = await Channel.create({
      channelName,
      description,
      owner: req.user._id,
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
    const channel = await Channel.findById(req.params.id).populate("videos");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
