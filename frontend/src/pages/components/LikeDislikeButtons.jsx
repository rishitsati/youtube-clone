import React, { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import {
  likeVideo,
  unlikeVideo,
  dislikeVideo,
  undislikeVideo,
} from "@/api/api";

function LikeDislikeButtons({
  videoId,
  initialLikes = 0,
  initialDislikes = 0,
  likedBy = [],
  dislikedBy = [],
  currentUserId,
  onUpdate,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState(null); 
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUserId && likedBy.length > 0) {
      const hasLiked = likedBy.some(
        (id) =>
          (typeof id === "string" && id === currentUserId) ||
          (typeof id === "object" && id._id === currentUserId) ||
          id === currentUserId
      );
      if (hasLiked) {
        setUserAction("like");
      }
    }
    if (currentUserId && dislikedBy.length > 0) {
      const hasDisliked = dislikedBy.some(
        (id) =>
          (typeof id === "string" && id === currentUserId) ||
          (typeof id === "object" && id._id === currentUserId) ||
          id === currentUserId
      );
      if (hasDisliked) {
        setUserAction("dislike");
      }
    }
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, [initialLikes, initialDislikes, likedBy, dislikedBy, currentUserId]);

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like videos");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (userAction === "like") {
        // Unlike
        await unlikeVideo(videoId, token);
        setLikes(Math.max(0, likes - 1));
        setUserAction(null);
      } else {
        // Like
        await likeVideo(videoId, token);
        setLikes(likes + 1);
        if (userAction === "dislike") {
          setDislikes(Math.max(0, dislikes - 1));
        }
        setUserAction("like");
      }
      onUpdate?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        alert(err.response.data?.message || "Action not allowed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert("Please login to dislike videos");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (userAction === "dislike") {
        // Remove dislike
        await undislikeVideo(videoId, token);
        setDislikes(Math.max(0, dislikes - 1));
        setUserAction(null);
      } else {
        // Dislike
        await dislikeVideo(videoId, token);
        setDislikes(dislikes + 1);
        if (userAction === "like") {
          setLikes(Math.max(0, likes - 1));
        }
        setUserAction("dislike");
      }
      onUpdate?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        alert(err.response.data?.message || "Action not allowed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors flex-1 sm:flex-none ${
          userAction === "like"
            ? "bg-yt-red text-white hover:bg-red-700"
            : "bg-yt-bg hover:bg-yt-hover text-yt-text"
        } disabled:opacity-50`}
        title="Like"
      >
        <FiThumbsUp size={18} />
        <span className="hidden sm:inline text-sm">{likes}</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors flex-1 sm:flex-none ${
          userAction === "dislike"
            ? "bg-yt-red text-white hover:bg-red-700"
            : "bg-yt-bg hover:bg-yt-hover text-yt-text"
        } disabled:opacity-50`}
        title="Dislike"
      >
        <FiThumbsDown size={18} />
        <span className="hidden sm:inline text-sm">{dislikes}</span>
      </button>
    </div>
  );
}

export default LikeDislikeButtons;
