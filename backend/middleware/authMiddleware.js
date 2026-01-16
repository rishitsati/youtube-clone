import jwt from "jsonwebtoken";
import User from "../models/User.js";

// This middleware checks if the user is logged in
const protect = async (req, res, next) => {
  try {
    let token;

    // Token is sent in Authorization header like: Bearer xxxxx
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token, user is not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    next(); // allow request to continue
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
