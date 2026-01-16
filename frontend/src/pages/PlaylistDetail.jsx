import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getPlaylist, addVideoToPlaylist, removeVideoFromPlaylist } from "../services/api";

function PlaylistDetail({ toggleDarkMode, darkMode }) {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getPlaylist(id, token || "")
      .then((res) => {
        setPlaylist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleRemoveVideo = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await removeVideoFromPlaylist(id, videoId, token);
      setPlaylist({
        ...playlist,
        videos: playlist.videos.filter((v) => v._id !== videoId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="flex justify-center items-center h-screen">
          <p>Playlist not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-[72px]"
          } p-6`}
        >
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {playlist.description}
          </p>

          {playlist.videos?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No videos in this playlist
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {playlist.videos?.map((video, index) => (
                <div
                  key={video._id}
                  className="flex gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xl font-bold text-gray-500 min-w-fit">
                    {index + 1}
                  </span>

                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-48 h-28 object-cover rounded cursor-pointer"
                    onClick={() => navigate(`/video/${video._id}`)}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="font-bold text-lg cursor-pointer hover:text-red-600"
                        onClick={() => navigate(`/video/${video._id}`)}
                      >
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {video.views} views
                      </span>
                      <button
                        onClick={() => handleRemoveVideo(video._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
