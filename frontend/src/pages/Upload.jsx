import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getUserChannels } from "@/api/api";
import React, { useEffect } from "react";

function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [channels, setChannels] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Gaming",
    channelId: "",
    tags: "",
  });
  const [files, setFiles] = useState({
    video: null,
    thumbnail: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Gaming",
    "Music",
    "Technology",
    "Education",
    "Entertainment",
    "Sports",
    "News",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user's channels
    getUserChannels(token)
      .then((res) => {
        setChannels(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            channelId: res.data[0]._id,
          }));
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.channelId ||
      !files.video ||
      !files.thumbnail
    ) {
      setError("Please fill all required fields");
      return;
    }

    setUploading(true);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("channelId", formData.channelId);
      if (formData.tags) {
        formDataToSend.append(
          "tags",
          formData.tags.split(",").map((t) => t.trim()),
        );
      }

      // Add files
      formDataToSend.append("video", files.video);
      formDataToSend.append("thumbnail", files.thumbnail);

      const response = await api.post("/videos", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      setSuccess("Video uploaded successfully!");
      setTimeout(() => {
        navigate(`/video/${response.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="flex pt-14">
        <main className="ml-64 flex-1 p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-8">
            Upload Video
          </h1>

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

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Selection */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Channel *
              </label>
              <select
                name="channelId"
                value={formData.channelId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
              >
                {channels.map((channel) => (
                  <option key={channel._id} value={channel._id}>
                    {channel.channelName}
                  </option>
                ))}
              </select>
            </div>

            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Video File * (MP4, WebM, etc.)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600">
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                  id="video-input"
                />
                <label htmlFor="video-input" className="cursor-pointer">
                  <p className="text-black dark:text-white font-medium">
                    {files.video ? files.video.name : "Click to select video"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    or drag and drop
                  </p>
                </label>
              </div>
            </div>

            {/* Thumbnail File */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Thumbnail * (JPG, PNG, etc.)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600">
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                  id="thumbnail-input"
                />
                <label htmlFor="thumbnail-input" className="cursor-pointer">
                  <p className="text-black dark:text-white font-medium">
                    {files.thumbnail
                      ? files.thumbnail.name
                      : "Click to select thumbnail"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    or drag and drop
                  </p>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Video Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white outline-none focus:border-blue-500"
                placeholder="What's the title of your video?"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formData.title.length}/100
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength="5000"
                rows="6"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white outline-none focus:border-blue-500"
                placeholder="Tell viewers about your video..."
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formData.description.length}/5000
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-red-600"
                placeholder="Describe your video"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white outline-none focus:border-red-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-red-600"
                placeholder="gaming, tutorial, fun"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploading || !formData.title.trim()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                {uploading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Upload;
