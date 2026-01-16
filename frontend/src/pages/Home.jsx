import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Home({ toggleDarkMode, darkMode }) {
  const categories = [
    "All",
    "Trending",
    "Music",
    "Gaming",
    "Educational",
    "Sports",
    "Movies",
    "News",
    "Live",
    "Tech",
  ];

  const [selected, setSelected] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryScroll, setCategoryScroll] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get("/videos")
      .then((res) => {
        setVideos(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const scrollCategory = (direction) => {
    const container = document.getElementById("category-scroll");
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
      setCategoryScroll(container.scrollLeft);
    }
  };

  return (
    <div className="bg-yt-dark text-yt-text min-h-screen">
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} />

        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* Category Filter Bar */}
          <div className="sticky top-14 bg-yt-dark z-20 border-b border-yt-hover px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCategory("left")}
                className="p-2 hover:bg-yt-hover rounded-full transition-colors flex-shrink-0"
              >
                <FaChevronLeft className="text-yt-secondary" />
              </button>

              <div
                id="category-scroll"
                className="flex gap-3 overflow-x-hidden flex-1 scroll-smooth"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelected(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all flex-shrink-0 ${
                      selected === cat
                        ? "bg-yt-text text-yt-dark"
                        : "bg-yt-bg border border-yt-hover text-yt-text hover:bg-yt-hover"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollCategory("right")}
                className="p-2 hover:bg-yt-hover rounded-full transition-colors flex-shrink-0"
              >
                <FaChevronRight className="text-yt-secondary" />
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-yt-secondary">No videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos
                  .filter((v) =>
                    selected === "All"
                      ? true
                      : v.category?.toLowerCase() === selected.toLowerCase()
                  )
                  .map((video) => (
                    <div key={video._id}>
                      <VideoCard video={video} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
