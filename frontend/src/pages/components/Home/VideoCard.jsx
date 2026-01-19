import { Link } from "react-router-dom";
import React, { useState } from "react";

function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);
  if (!video) return null;

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views;
  };

  const duration = video.duration || "0:00";

  return (
    <Link
      to={`/video/${video._id}`}
      className=""
      style={{ margin: "10px 0 10px 0" }}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail Container */}
        <div className="relative rounded-[6px] overflow-hidden bg-gray-800 mb-3">
          <img
            src={
              video.thumbnailUrl ||
              "https://via.placeholder.com/320x180?text=No+Thumbnail"
            }
            alt={video.title}
            className={`transition-transform duration-200 ${hovered ? "scale-105" : "scale-100"}`}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Duration */}
          <div
            className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded"
            style={{ marginTop: "10px" }}
          >
            {duration}
          </div>

          {/* Hover overlay play */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="w-12 h-12 rounded-full bg-black bg-opacity-60 flex items-center justify-center text-white text-2xl">
              ▶
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
              {video.channel?.channelName?.charAt(0) || "U"}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-white font-semibold line-clamp-2">
              {video.title}
            </h3>

            <p className="text-gray-400 text-sm mt-1 truncate">
              {video.channel?.channelName || "Unknown Channel"}
            </p>

            <p className="text-gray-400 text-sm mt-1">
              {formatViews(video.views)} views •{" "}
              {video.createdAt
                ? new Date(video.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
