import React, { useState, useEffect } from "react";
import api from "../api/api";
import VideoCard from "./components/Home/VideoCard";
import { Link } from "react-router-dom";
export default function Home() {
  const [selected, setSelected] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/videos")
      .then((res) => {
        setVideos(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="text-white bg-black">
      <div>Categories</div>
      <div className="">
        {/* Videos Area */}
        <div style={{ padding: "12px" }}>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No videos found</p>
            </div>
          ) : (
            <div className="p-[40px]">
              {/* Featured Hero (first video) */}
              {videos.length > 0 &&
                (() => {
                  const featured = videos[0];

                  if (
                    selected !== "All" &&
                    featured.category?.toLowerCase() !== selected.toLowerCase()
                  ) {
                    return null;
                  }

                  const formatViews = (views) => {
                    if (!views) return "0";
                    if (views >= 1000000)
                      return (views / 1000000).toFixed(1) + "M";
                    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
                    return views;
                  };

                  return (
                    <a
                      href={`/video/${featured._id}`}
                      className=" group mb-8 aspect-video w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-[260px]"
                    >
                      <div className="cursor-pointer">
                        {/* Thumbnail Container */}
                        <div className="relative rounded-[6px] overflow-hidden bg-gray-800 mb-3 aspect-video">
                          <img
                            src={
                              featured.thumbnailUrl ||
                              "https://via.placeholder.com/1280x720?text=No+Thumbnail"
                            }
                            alt={featured.title}
                            className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />

                          {/* Duration (optional if available) */}
                          {featured.duration && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                              {featured.duration}
                            </div>
                          )}

                          {/* Hover overlay play */}
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                            <div className="w-14 h-14 rounded-full bg-black bg-opacity-60 flex items-center justify-center text-white text-3xl">
                              ▶
                            </div>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex gap-3 items-start">
                          {/* Channel Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                              {featured.channel?.channelName?.charAt(0) || "U"}
                            </div>
                          </div>

                          {/* Text Info */}
                          <div className="min-w-0 mt-[16px]">
                            <h2 className="text-white text-lg font-semibold line-clamp-2">
                              {featured.title}
                            </h2>

                            <p className="text-gray-400 text-sm mt-1 truncate">
                              {featured.channel?.channelName ||
                                "Unknown Channel"}
                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                              {formatViews(featured.views || 0)} views •{" "}
                              {featured.createdAt
                                ? new Date(
                                    featured.createdAt,
                                  ).toLocaleDateString()
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })()}

              {/* Grid of videos (skip featured) */}
              <div style={{ width: "100%", marginTop: "10px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
                  {videos
                    .filter((v, i) => {
                      if (i === 0) return false;
                      if (selected === "All") return true;
                      return (
                        v.category?.toLowerCase() === selected.toLowerCase()
                      );
                    })
                    .map((video) => (
                      <div key={video._id} className="w-full">
                        <VideoCard video={video} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
