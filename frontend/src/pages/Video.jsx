import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/api/api";
import VideoCard from "./components/Home/VideoCard";
import { Share2Icon } from "lucide-react";
import AddToPlaylistButton from "./components/Video/AddToPlaylistButton";
import CommentItem from "./components/CommentItem";
import LikeDislikeButtons from "./components/LikeDislikeButtons";
import SubscribeButton from "./components/SubscribeButton";

function Video() {
  const { id } = useParams();
  //const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [text, setText] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load current video
    api.get("/videos").then((res) => {
      const found = res.data.find((v) => v._id === id);
      setVideo(found);
      const related = res.data
        .filter((v) => v._id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
      setAllVideos(related);
    });
    // Increase view count when page opens
    api.put(`/videos/${id}/view`);

    // Load comments
    api.get(`/comments/${id}`).then((res) => {
      setComments(res.data);
    });

    // Get current user ID if logged in
    if (token) {
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setCurrentUserId(res.data._id || res.data.id);
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem("token");
        });
    }
  }, [id, token]);

  // Check subscription status when video and user are loaded
  useEffect(() => {
    if (token && video?.channel?._id && currentUserId) {
      api.get(`/channels/${video.channel._id}/is-subscribed`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setIsSubscribed(res.data.isSubscribed || false);
        })
        .catch(() => {
          setIsSubscribed(false);
        });
    } else {
      setIsSubscribed(false);
    }
  }, [token, video?.channel?._id, currentUserId]);

  const handleVideoUpdate = async () => {
    // Reload video data after like/dislike action
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribeUpdate = async () => {
    // Reload video data to get updated subscription count
    if (video?.channel?._id && token) {
      try {
        const res = await api.get(`/channels/${video.channel._id}/is-subscribed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSubscribed(res.data.isSubscribed || false);
        
        // Also reload video to get updated channel subscriber count
        const videoRes = await api.get(`/videos/${id}`);
        setVideo(videoRes.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addComment = async () => {
    const commentText = replyToId ? replyText : text;
    if (!commentText.trim()) return;

    try {
      const res = await api.post(
        "/comments",
        {
          text: commentText,
          videoId: id,
          parentCommentId: replyToId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (replyToId) {
        // Reload comments to get updated replies
        api.get(`/comments/${id}`).then((res) => {
          setComments(res.data);
        });
        setReplyToId(null);
        setReplyText("");
      } else {
        setComments([...comments, res.data]);
        setText("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Reload comments
      api.get(`/comments/${id}`).then((res) => {
        setComments(res.data);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyToId(commentId);
    // Focus on comment input
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Add a comment..."]');
      if (input) input.focus();
    }, 100);
  };
  if (!video)
    return (
      <div className="bg-yt-dark text-yt-text text-center min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
      </div>
    );

  return (
    <div className="bg-yt-dark min-h-screen text-yt-text ">
      <div
        className="flex flex-col lg:flex-row pt-14 gap-3 "
        style={{ padding: "10px" }}
      >
        {/* MAIN CONTENT */}
        <div className="lg:flex-1 px-4 py-6 w-full max-w-5xl">
          {/* VIDEO PLAYER */}
          <div className="w-full bg-yt-bg rounded-lg overflow-hidden mb-6 aspect-video">
            <video
              className="w-full h-full "
              controls
              controlsList="nodownload"
              src={video.videoUrl}
            ></video>
          </div>

          {/* VIDEO TITLE */}
          <h1 className="text-2xl font-bold text-yt-text mb-[20px] line-clamp-2">
            {video.title}
          </h1>

          {/* CHANNEL INFO & ACTIONS ROW */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-yt-hover mb-6"
            style={{ padding: "10px 0px 10px 0px" }}
          >
            {/* Left: Channel Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yt-hover flex items-center justify-center text-lg font-bold text-yt-secondary flex-shrink-0">
                {video.channel?.channelName?.charAt(0) || "C"}
              </div>
              <div>
                <h3 className="font-semibold text-yt-text">
                  {video.channel?.channelName || "Unknown Channel"}
                </h3>
                <p className="text-sm text-yt-secondary">
                  {video.channel?.subscribers || 0} subscribers
                </p>
              </div>
              {video?.channel?._id && (
                <SubscribeButton
                  channelId={video.channel._id}
                  isSubscribed={isSubscribed}
                  onSubscribe={handleSubscribeUpdate}
                />
              )}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto items-center">
              <LikeDislikeButtons
                videoId={id}
                initialLikes={video.likes || 0}
                initialDislikes={video.dislikes || 0}
                likedBy={video.likedBy || []}
                dislikedBy={video.dislikedBy || []}
                currentUserId={currentUserId}
                onUpdate={handleVideoUpdate}
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors flex-1 sm:flex-none">
                <Share2Icon className="text-lg" />
                <span className="hidden sm:inline text-sm">Share</span>
              </button>
              <AddToPlaylistButton videoId={id} />
              <button className="px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors">
                {/* <FaEllipsisV className="text-lg" /> */}
              </button>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div
            className="bg-yt-bg rounded-lg p-4 mb-8"
            style={{ padding: "10px 0px 10px 0px" }}
          >
            <p className="text-sm text-yt-secondary mb-3">
              <span className="font-semibold text-yt-text">
                {video.views || 0} views
              </span>
              <span> • {new Date(video.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-yt-text whitespace-pre-wrap">
              {video.description}
            </p>
          </div>

          {/* COMMENTS SECTION */}
          <div className="mb-8">
            <h3
              className="text-xl font-bold mb-6 text-yt-text"
              style={{ padding: "10px 0px 10px 0px" }}
            >
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>

            {/* Comment Input */}
            {token ? (
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-yt-hover flex items-center justify-center text-sm font-bold text-yt-secondary shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  {replyToId && (
                    <div className="mb-2 p-2 bg-yt-bg rounded text-sm text-yt-secondary">
                      Replying to comment...
                      <button
                        onClick={() => {
                          setReplyToId(null);
                          setReplyText("");
                        }}
                        className="ml-2 text-yt-red hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <input
                    className="w-full bg-transparent border-b border-yt-hover text-yt-text placeholder-yt-secondary outline-none pb-2 focus:border-yt-red transition-colors"
                    value={replyToId ? replyText : text}
                    onChange={(e) => {
                      if (replyToId) {
                        setReplyText(e.target.value);
                      } else {
                        setText(e.target.value);
                      }
                    }}
                    placeholder={replyToId ? "Add a reply..." : "Add a comment..."}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (replyToId && replyText.trim()) {
                          addComment();
                        } else if (!replyToId && text.trim()) {
                          addComment();
                        }
                      }
                    }}
                  />
                  <div className="flex gap-2 mt-4 justify-end">
                    {(text || replyText) && (
                      <button
                        onClick={() => {
                          setText("");
                          setReplyToId(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2 text-yt-text hover:bg-yt-hover rounded transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={addComment}
                      disabled={!text.trim() && !replyText.trim()}
                      className="px-4 py-2 bg-yt-text text-yt-dark hover:bg-yt-secondary disabled:bg-yt-secondary/50 disabled:text-yt-dark/50 rounded font-medium text-sm transition-colors"
                    >
                      {replyToId ? "Reply" : "Comment"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-yt-secondary text-sm mb-6">
                <a href="/login" className="text-yt-red hover:underline">
                  Sign in
                </a>{" "}
                to comment
              </p>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-yt-secondary text-sm">
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    onDelete={handleDeleteComment}
                    onReplyClick={handleReplyClick}
                    currentUserId={currentUserId}
                    depth={0}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR: RECOMMENDED VIDEOS */}
        <div className="lg:w-96 px-4 py-6 border-l border-yt-hover overflow-y-auto max-h-[calc(100vh-56px)]">
          <h3
            className="text-base font-semibold text-yt-text mb-4"
            style={{ padding: "10px 0px 10px 0px" }}
          >
            Recommended
          </h3>
          <div className="space-y-4">
            {allVideos.length === 0 ? (
              <p className="text-yt-secondary text-sm">No recommendations</p>
            ) : (
              allVideos.map((v) => (
                <div key={v._id}>
                  <VideoCard video={v} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
