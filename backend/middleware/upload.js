import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `${uploadsDir}/${req.user._id}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// File filter for videos and images
const fileFilter = (req, file, cb) => {
  const allowedVideoMimes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];
  const allowedImageMimes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  const allowedMimes = [...allowedVideoMimes, ...allowedImageMimes];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${allowedMimes.join(", ")}`
      ),
      false
    );
  }
};

// Configure limits
const limits = {
  fileSize: 500 * 1024 * 1024, // 500MB for videos
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
