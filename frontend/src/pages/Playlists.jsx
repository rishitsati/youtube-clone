import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
} from "../services/api";

function Playlists({ toggleDarkMode, darkMode }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchPlaylists(token);
  }, [navigate]);

  const fetchPlaylists = (token) => {
    getUserPlaylists(token)
      .then((res) => {
        setPlaylists(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await createPlaylist(formData, token);
      setFormData({ name: "", description: "", isPublic: false });
      setShowCreateForm(false);
      fetchPlaylists(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Delete this playlist?")) {
      const token = localStorage.getItem("token");
      try {
        await deletePlaylist(playlistId, token);
        fetchPlaylists(token);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Playlists</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
            >
              {showCreateForm ? "Cancel" : "Create Playlist"}
            </button>
          </div>

          {showCreateForm && (
            <form
              onSubmit={handleCreatePlaylist}
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mb-6"
            >
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Playlist Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter playlist name"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter playlist description"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span>Make this playlist public</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
              >
                Create Playlist
              </button>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                You have no playlists yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <div className="relative bg-gray-300 dark:bg-gray-700 aspect-video flex items-center justify-center">
                    {playlist.thumbnail ? (
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">📋</div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {playlist.videos?.length || 0} videos
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold truncate mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
                      {playlist.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.location.href = `/playlist/${playlist._id}`
                        }
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-semibold transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePlaylist(playlist._id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold transition-colors"
                      >
                        Delete
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

export default Playlists;
