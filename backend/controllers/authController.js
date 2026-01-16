import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
        });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("channels", "channelName channelAvatar subscribers")
      .populate("subscriptions", "channelName channelAvatar")
      .populate("playlists", "name");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    // Check if username is being changed and if it's unique
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username already taken" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar }),
      },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New passwords do not match" });
    }

    // Get user with password field
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password required to delete account" });
    }

    // Get user with password field
    const user = await User.findById(req.user._id);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Delete user
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
