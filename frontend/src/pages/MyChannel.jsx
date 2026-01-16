import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getUserChannels, updateChannel } from "../services/api";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

function MyChannel({ toggleDarkMode, darkMode }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChannel, setEditingChannel] = useState(null);
  const [formData, setFormData] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
    channelAvatar: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getUserChannels(token)
      .then((res) => {
        setChannels(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load channels");
        setLoading(false);
      });
  }, [navigate]);

  const handleEditClick = (channel) => {
    setEditingChannel(channel._id);
    setFormData({
      channelName: channel.channelName,
      description: channel.description,
      channelBanner: channel.channelBanner || "",
      channelAvatar: channel.channelAvatar || "",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await updateChannel(editingChannel, formData, token);
      setSuccess("Channel updated successfully!");
      
      // Update local state
      setChannels((prev) =>
        prev.map((ch) =>
          ch._id === editingChannel ? { ...ch, ...formData } : ch
        )
      );

      setEditingChannel(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update channel");
    }
  };

  const handleCancel = () => {
    setEditingChannel(null);
    setError("");
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
          <h1 className="text-3xl font-bold mb-6">My Channels</h1>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded mb-4">
              {success}
            </div>
          )}

          {channels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                You don't have any channels yet
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
              >
                Create Channel
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {channels.map((channel) => (
                <div
                  key={channel._id}
                  className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
                >
                  {/* Channel Banner */}
                  <div className="relative bg-gradient-to-r from-red-500 to-red-700 h-32">
                    {channel.channelBanner && (
                      <img
                        src={channel.channelBanner}
                        alt="banner"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Channel Info */}
                  <div className="px-6 py-4 relative">
                    <div className="flex gap-4 items-start">
                      {/* Avatar */}
                      <div className="flex-shrink-0 -mt-12">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-900 bg-gray-300 dark:bg-gray-700 overflow-hidden">
                          {channel.channelAvatar ? (
                            <img
                              src={channel.channelAvatar}
                              alt={channel.channelName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              📺
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info or Edit Form */}
                      <div className="flex-1 mt-2">
                        {editingChannel === channel._id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Channel Name
                              </label>
                              <input
                                type="text"
                                name="channelName"
                                value={formData.channelName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Banner URL
                              </label>
                              <input
                                type="url"
                                name="channelBanner"
                                value={formData.channelBanner}
                                onChange={handleInputChange}
                                placeholder="https://example.com/banner.jpg"
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Avatar URL
                              </label>
                              <input
                                type="url"
                                name="channelAvatar"
                                value={formData.channelAvatar}
                                onChange={handleInputChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
                              >
                                <FiSave size={18} />
                                Save Changes
                              </button>
                              <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-white font-semibold"
                              >
                                <FiX size={18} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h2 className="text-2xl font-bold mb-2">
                              {channel.channelName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {channel.description}
                            </p>

                            <div className="flex gap-4 text-sm mb-4">
                              <div>
                                <p className="font-semibold text-red-600">
                                  {channel.videos?.length || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Videos
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold text-red-600">
                                  {channel.subscribers || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Subscribers
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(channel)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
                              >
                                <FiEdit2 size={18} />
                                Edit Channel
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/channel/${channel._id}`)
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-white font-semibold"
                              >
                                View Public Page
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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

export default MyChannel;
