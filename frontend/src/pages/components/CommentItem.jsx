import React,{ useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { likeComment, unlikeComment } from "@/api/api";

function CommentItem({ comment, onDelete, onReplyClick, depth = 0, currentUserId }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Check if user has liked this comment and set initial likes count
  useEffect(() => {
    if (comment.likes !== undefined) {
      setLikes(comment.likes);
    }
    if (comment.likedBy && currentUserId) {
      const hasLiked = comment.likedBy.some(
        (id) =>
          (typeof id === "string" && id === currentUserId) ||
          (typeof id === "object" && id._id === currentUserId) ||
          id === currentUserId
      );
      setLiked(hasLiked);
    }
  }, [comment.likedBy, comment.likes, currentUserId]);

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like comments");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (liked) {
        const res = await unlikeComment(comment._id, token);
        setLikes(res.data.likes);
        setLiked(false);
      } else {
        const res = await likeComment(comment._id, token);
        setLikes(res.data.likes);
        setLiked(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUserId && (comment.user?._id === currentUserId || comment.user === currentUserId);

  return (
    <div
      className={`mb-4 ${depth > 0 ? "ml-12" : ""}`}
      style={{ paddingLeft: depth > 0 ? "16px" : "0" }}
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-yt-hover flex items-center justify-center text-sm font-bold text-yt-secondary shrink-0 overflow-hidden">
          {comment.user?.avatar ? (
            <img
              src={comment.user.avatar}
              alt={comment.user?.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{comment.user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
          )}
        </div>

        <div className="flex-1 bg-yt-bg rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm text-yt-text">{comment.user?.username || "User"}</p>
            <p className="text-xs text-yt-secondary">
              {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
            </p>
          </div>

          <p className="text-sm mb-2 text-yt-text">{comment.text}</p>

          <div className="flex items-center gap-4 text-xs text-yt-secondary">
            <button
              onClick={handleLike}
              disabled={loading}
              className="flex items-center gap-1 hover:text-yt-red transition-colors disabled:opacity-50"
            >
              {liked ? (
                <FaHeart size={14} className="text-yt-red" />
              ) : (
                <FiHeart size={14} />
              )}
              <span>{likes}</span>
            </button>

            {onReplyClick && (
              <button
                onClick={() => onReplyClick?.(comment._id)}
                className="hover:text-yt-text transition-colors"
              >
                Reply
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => onDelete?.(comment._id)}
                className="hover:text-yt-red transition-colors"
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
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
