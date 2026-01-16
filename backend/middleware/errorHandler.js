// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(400)
      .json({ message: `${field} already exists` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
