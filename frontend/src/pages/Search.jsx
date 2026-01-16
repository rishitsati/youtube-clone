import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { FaSearch } from "react-icons/fa";

function Search() {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/videos`)
      .then(res => {
        // Filter videos by query
        const filtered = res.data.filter(v => 
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.description.toLowerCase().includes(query.toLowerCase())
        );
        setVideos(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="bg-yt-dark text-yt-text min-h-screen">
      <Header />

      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} p-6`}>
          
          {/* Search Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FaSearch className="text-yt-secondary" />
              <h2 className="text-2xl font-semibold text-yt-text">
                Search results for: "<span className="text-yt-red">{query}</span>"
              </h2>
            </div>
            <p className="text-yt-secondary text-sm">
              Found {videos.length} {videos.length === 1 ? "result" : "results"}
            </p>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <FaSearch className="text-6xl text-yt-hover mb-4" />
              <p className="text-yt-secondary text-lg">No results found for "{query}"</p>
              <p className="text-yt-secondary text-sm mt-2">Try different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map(video => (
                <div key={video._id}>
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
