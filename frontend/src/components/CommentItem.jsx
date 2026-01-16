import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { likeComment, unlikeComment } from "../services/api";

function CommentItem({ comment, onDelete, onReplyClick, depth = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like comments");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (liked) {
        await unlikeComment(comment._id, token);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likeComment(comment._id, token);
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = localStorage.getItem("userId") === comment.user?._id;

  return (
    <div
      className={`mb-4 ${depth > 0 ? "ml-12" : ""}`}
      style={{ paddingLeft: depth > 0 ? "16px" : "0" }}
    >
      <div className="flex gap-3">
        <img
          src={comment.user?.avatar || "https://via.placeholder.com/40"}
          alt={comment.user?.username}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm">{comment.user?.username}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="text-sm mb-2">{comment.text}</p>

          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <button
              onClick={handleLike}
              disabled={loading}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              {liked ? (
                <FaHeart size={14} className="text-red-600" />
              ) : (
                <FiHeart size={14} />
              )}
              <span>{likes}</span>
            </button>

            <button
              onClick={() => onReplyClick?.(comment._id)}
              className="hover:text-blue-600 transition-colors"
            >
              Reply
            </button>

            {isOwner && (
              <button
                onClick={() => onDelete?.(comment._id)}
                className="hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReplyClick={onReplyClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
