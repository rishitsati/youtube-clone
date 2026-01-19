import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/api";
import VideoCard from "./components/Home/VideoCard";

function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/channels/${id}`)
      .then((res) => {
        setChannel(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const subscribe = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(
        `/channels/${id}/subscribe`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-yt-dark text-yt-text min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yt-red"></div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="bg-yt-dark text-yt-text min-h-screen flex items-center justify-center">
        <p>Channel not found</p>
      </div>
    );
  }

  return (
    <div className="bg-yt-dark text-yt-text min-h-screen">
      <div className="flex pt-14">
        <div
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {/* CHANNEL BANNER */}
          <div className="relative h-48 bg-gradient-to-b from-yt-bg to-yt-dark overflow-hidden">
            {channel.channelBanner ? (
              <img
                src={channel.channelBanner}
                alt="Channel Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-yt-hover"></div>
            )}
          </div>

          {/* CHANNEL INFO */}
          <div className="px-6 py-8 border-b border-yt-hover">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar & Name */}
              <div className="flex gap-4 items-start md:items-center">
                <div className="w-20 h-20 rounded-full bg-yt-hover flex items-center justify-center text-3xl font-bold text-yt-secondary flex-shrink-0 overflow-hidden">
                  {channel.channelAvatar ? (
                    <img
                      src={channel.channelAvatar}
                      alt="Channel"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    channel.channelName?.charAt(0)
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-yt-text">
                    {channel.channelName}
                  </h1>
                  <p className="text-yt-secondary mt-1">
                    {channel.subscribers || 0} subscribers •{" "}
                    {channel.videos?.length || 0} videos
                  </p>
                  <p className="text-yt-text text-sm mt-3 line-clamp-2">
                    {channel.description}
                  </p>
                </div>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={subscribe}
                className={`px-6 py-2 rounded-full font-semibold transition-colors whitespace-nowrap ml-auto ${
                  isSubscribed
                    ? "bg-yt-hover text-yt-text hover:bg-yt-hover/80"
                    : "bg-yt-red text-yt-dark hover:bg-red-700"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>

          {/* CHANNEL STATS */}
          <div className="grid grid-cols-3 gap-6 px-6 py-8 border-b border-yt-hover">
            <div className="text-center">
              <p className="text-2xl font-bold text-yt-red">
                {channel.videos?.length || 0}
              </p>
              <p className="text-yt-secondary text-sm mt-2">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yt-red">
                {channel.subscribers || 0}
              </p>
              <p className="text-yt-secondary text-sm mt-2">Subscribers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yt-red">0</p>
              <p className="text-yt-secondary text-sm mt-2">Total Views</p>
            </div>
          </div>

          {/* VIDEOS SECTION */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-yt-text mb-6">
              Latest Videos
            </h2>

            {!channel.videos || channel.videos.length === 0 ? (
              <p className="text-yt-secondary text-center py-12">
                No videos yet
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {channel.videos.map((v) => (
                  <div key={v._id}>
                    <VideoCard video={v} />
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

export default Channel;
