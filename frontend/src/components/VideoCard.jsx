import { Link } from "react-router-dom";
import { useState } from "react";

function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!video) return null;

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views;
  };

  const formatDate = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <Link 
      to={`/video/${video._id}`}
      className="group no-underline"
    >
      <div className="cursor-pointer">
        
        {/* Thumbnail Container */}
        <div 
          className="relative rounded-lg overflow-hidden bg-yt-bg aspect-video mb-3 flex-shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={video.thumbnailUrl || "https://via.placeholder.com/320x180?text=No+Thumbnail"}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isHovered ? "opacity-75" : "opacity-100"
            }`}
          />
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-yt-dark bg-opacity-80 px-2 py-1 rounded text-xs font-semibold text-yt-text">
            12:34
          </div>

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-white text-4xl">▶</div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex gap-3">
          
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-yt-hover flex items-center justify-center text-sm font-bold text-yt-secondary">
              {video.channel?.channelName?.charAt(0) || "C"}
            </div>
          </div>

          {/* Title and Metadata */}
          <div className="flex-1 min-w-0">
            <h3 className="text-yt-text font-semibold text-sm line-clamp-2 group-hover:text-yt-text">
              {video.title}
            </h3>

            <Link
              to={`/channel/${video.channel?._id}`}
              onClick={(e) => e.preventDefault()}
              className="text-yt-secondary text-xs hover:text-yt-text transition-colors block mt-1"
            >
              {video.channel?.channelName || "Unknown Channel"}
            </Link>

            <p className="text-yt-secondary text-xs mt-1">
              {formatViews(video.views || 0)} views • {formatDate(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
