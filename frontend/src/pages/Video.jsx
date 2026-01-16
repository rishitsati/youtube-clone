import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import { FaThumbsUp, FaThumbsDown, FaShare, FaBell, FaEllipsisV, FaChevronDown } from "react-icons/fa";

function Video() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

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
  }, [id]);

  const like = async () => {
    const res = await api.put(
      `/videos/${id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setVideo(res.data);
  };

  const dislike = async () => {
    const res = await api.put(
      `/videos/${id}/dislike`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setVideo(res.data);
  };

  const subscribe = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(
        `/channels/${video.channel?._id}/subscribe`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async () => {
    if (!text) return;

    const res = await api.post(
      "/comments",
      {
        text,
        videoId: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setComments([...comments, res.data]);
    setText("");
  };
  if (!video)
    return (
      <div className="bg-yt-dark text-yt-text text-center min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
      </div>
    );

  return (
    <div className="bg-yt-dark min-h-screen text-yt-text">
      <Header />

      <div className="flex flex-col lg:flex-row pt-14">
        
        {/* MAIN CONTENT */}
        <div className="lg:flex-1 px-4 py-6 max-w-5xl">
          
          {/* VIDEO PLAYER */}
          <div className="w-full bg-yt-bg rounded-lg overflow-hidden mb-6 aspect-video">
            <video
              className="w-full h-full bg-black"
              controls
              controlsList="nodownload"
              src={video.videoUrl}
            ></video>
          </div>

          {/* VIDEO TITLE */}
          <h1 className="text-2xl font-bold text-yt-text mb-4 line-clamp-2">
            {video.title}
          </h1>

          {/* CHANNEL INFO & ACTIONS ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-yt-hover mb-6">
            
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
              <button
                onClick={subscribe}
                className={`ml-4 px-6 py-2 rounded-full font-semibold transition-colors whitespace-nowrap text-sm ${
                  isSubscribed
                    ? "bg-yt-hover text-yt-text hover:bg-yt-hover/80"
                    : "bg-yt-red text-yt-dark hover:bg-red-700"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={like}
                className="flex items-center gap-2 px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors flex-1 sm:flex-none"
                title="Like"
              >
                <FaThumbsUp className="text-lg" />
                <span className="hidden sm:inline text-sm">{video.likes || 0}</span>
              </button>
              <button
                onClick={dislike}
                className="flex items-center gap-2 px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors flex-1 sm:flex-none"
                title="Dislike"
              >
                <FaThumbsDown className="text-lg" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors flex-1 sm:flex-none">
                <FaShare className="text-lg" />
                <span className="hidden sm:inline text-sm">Share</span>
              </button>
              <button className="px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors">
                <FaEllipsisV className="text-lg" />
              </button>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="bg-yt-bg rounded-lg p-4 mb-8">
            <p className="text-sm text-yt-secondary mb-3">
              <span className="font-semibold text-yt-text">{video.views || 0} views</span>
              <span> • {new Date(video.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-yt-text whitespace-pre-wrap">{video.description}</p>
          </div>

          {/* COMMENTS SECTION */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 text-yt-text">
              Comments {comments.length > 0 && `(${comments.length})`}
            </h3>

            {/* Comment Input */}
            {token ? (
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-yt-hover flex items-center justify-center text-sm font-bold text-yt-secondary flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <input
                    className="w-full bg-transparent border-b border-yt-hover text-yt-text placeholder-yt-secondary outline-none pb-2 focus:border-yt-red transition-colors"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <div className="flex gap-2 mt-4 justify-end">
                    <button
                      onClick={() => setText("")}
                      className="px-4 py-2 text-yt-text hover:bg-yt-hover rounded transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addComment}
                      disabled={!text.trim()}
                      className="px-4 py-2 bg-yt-text text-yt-dark hover:bg-yt-secondary disabled:bg-yt-secondary/50 disabled:text-yt-dark/50 rounded font-medium text-sm transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-yt-secondary text-sm mb-6">
                <a href="/login" className="text-yt-red hover:underline">
                  Sign in
                </a>
                {" "}to comment
              </p>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-yt-secondary text-sm">No comments yet. Be the first!</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-yt-hover flex items-center justify-center text-sm font-bold text-yt-secondary flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      {editId === c._id ? (
                        <div>
                          <textarea
                            className="w-full bg-yt-bg border border-yt-hover text-yt-text rounded p-2 mb-2 outline-none focus:border-yt-red"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                const res = await api.put(
                                  `/comments/${c._id}`,
                                  { text: editText },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                setComments(
                                  comments.map((x) => (x._id === c._id ? res.data : x))
                                );
                                setEditId(null);
                              }}
                              className="text-yt-red hover:text-red-600 text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="text-yt-secondary hover:text-yt-text text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-semibold text-sm text-yt-text">
                              {c.user?.username || "User"}
                            </p>
                            <p className="text-xs text-yt-secondary">2 days ago</p>
                          </div>
                          <p className="text-yt-text text-sm mt-2">{c.text}</p>
                          {token && (
                            <div className="flex gap-4 mt-3 text-xs text-yt-secondary">
                              <button className="hover:text-yt-text transition-colors">
                                👍 Like
                              </button>
                              <button className="hover:text-yt-text transition-colors">
                                👎 Dislike
                              </button>
                              <button
                                onClick={() => {
                                  setEditId(c._id);
                                  setEditText(c.text);
                                }}
                                className="hover:text-yt-text transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  await api.delete(`/comments/${c._id}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  setComments(comments.filter((x) => x._id !== c._id));
                                }}
                                className="hover:text-yt-text transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR: RECOMMENDED VIDEOS */}
        <div className="lg:w-96 px-4 py-6 border-l border-yt-hover overflow-y-auto max-h-[calc(100vh-56px)]">
          <h3 className="text-base font-semibold text-yt-text mb-4">Recommended</h3>
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
