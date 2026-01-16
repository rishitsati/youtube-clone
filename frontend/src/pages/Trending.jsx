import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import api from "../services/api";
import { FaFire } from "react-icons/fa";

function Trending() {
  const [videos, setVideos] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/videos")
      .then((res) => {
        // Sort by views to show trending
        const sorted = res.data.sort((a, b) => (b.views || 0) - (a.views || 0));
        setVideos(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-yt-dark text-yt-text min-h-screen">
      <Header />
      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}>
          {/* Trending Header */}
          <div className="bg-gradient-to-r from-yt-bg to-yt-hover border-b border-yt-hover p-8">
            <div className="flex items-center gap-3 max-w-6xl mx-auto">
              <FaFire className="text-3xl text-yt-red" />
              <div>
                <h1 className="text-4xl font-bold text-yt-text">
                  Trending
                </h1>
                <p className="text-yt-secondary mt-1">
                  Check out the most viewed videos right now
                </p>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-yt-secondary">No trending videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <div key={video._id}>
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Trending;
