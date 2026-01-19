import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./components/Home/VideoCard";
import api from "@/api/api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [playlistName, setPlaylistName] = useState("");
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    Promise.all([
      api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/videos/history", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get("/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([userRes, historyRes, playlistRes]) => {
        setUser(userRes.data);
        setWatchHistory(historyRes.data || []);
        setPlaylists(playlistRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [navigate]);

  const createPlaylist = async () => {
    if (!playlistName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/playlists",
        { name: playlistName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPlaylistName("");
      setShowPlaylistForm(false);
      // Refetch playlists
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen">
        <div className="flex pt-14">

          <div className="flex-1 flex items-center justify-center h-screen">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="flex">

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-[72px]"
          }`}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-b from-blue-600 to-transparent p-8 pb-16">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold">{user?.username}</h1>
                <p className="text-blue-100 mt-2">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 sticky top-14 bg-white dark:bg-black z-20">
            <div className="flex px-6">
              {["profile", "history", "playlists"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt).toLocaleDateString()}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white"
                    />
                  </div>

                  <button
                    onClick={logout}
                    className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                  Watch History
                </h2>
                {watchHistory.length === 0 ? (
                  <div className="text-gray-600 dark:text-gray-400 py-12 text-center">
                    No videos in your watch history
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {watchHistory.map((video) => (
                      <VideoCard key={video._id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Playlists Tab */}
            {activeTab === "playlists" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    My Playlists
                  </h2>
                  <button
                    onClick={() => setShowPlaylistForm(!showPlaylistForm)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    + New Playlist
                  </button>
                </div>

                {showPlaylistForm && (
                  <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="Playlist name"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={createPlaylist}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowPlaylistForm(false)}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {playlists.length === 0 ? (
                  <div className="text-gray-600 dark:text-gray-400 py-12 text-center">
                    No playlists yet. Create your first one!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playlists.map((playlist) => (
                      <div
                        key={playlist._id}
                        className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition"
                      >
                        <div className="text-3xl mb-2">📋</div>
                        <h3 className="font-semibold text-black dark:text-white">
                          {playlist.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {playlist.videos?.length || 0} videos
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
