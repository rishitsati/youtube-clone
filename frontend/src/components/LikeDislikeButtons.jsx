import { useState } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { likeVideo, unlikeVideo, dislikeVideo, undislikeVideo } from "../services/api";

function LikeDislikeButtons({ videoId, initialLikes = 0, initialDislikes = 0, onUpdate }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState(null); // 'like', 'dislike', or null
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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
        setLikes(likes - 1);
        setUserAction(null);
      } else {
        // Like
        await likeVideo(videoId, token);
        setLikes(likes + 1);
        if (userAction === "dislike") {
          setDislikes(dislikes - 1);
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
        setDislikes(dislikes - 1);
        setUserAction(null);
      } else {
        // Dislike
        await dislikeVideo(videoId, token);
        setDislikes(dislikes + 1);
        if (userAction === "like") {
          setLikes(likes - 1);
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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
          userAction === "like"
            ? "bg-red-600 text-white"
            : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
        } disabled:opacity-50`}
      >
        <FiThumbsUp size={18} />
        <span>{likes}</span>
      </button>

      <button
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
          userAction === "dislike"
            ? "bg-red-600 text-white"
            : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
        } disabled:opacity-50`}
      >
        <FiThumbsDown size={18} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}

export default LikeDislikeButtons;
