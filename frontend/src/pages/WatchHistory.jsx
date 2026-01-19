import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./components/Home/VideoCard";
import { getWatchHistory, clearWatchHistory } from "@/api/api";

function WatchHistory({ toggleDarkMode, darkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getWatchHistory(token)
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your watch history?")) {
      const token = localStorage.getItem("token");
      try {
        await clearWatchHistory(token);
        setHistory([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <div className="flex pt-14">
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-[72px]"
          } p-6`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Watch History</h1>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Your watch history is empty
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.map((item) => (
                <VideoCard
                  key={item._id}
                  video={item.video}
                  watchedAt={item.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
