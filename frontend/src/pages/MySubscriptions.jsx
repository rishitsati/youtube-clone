import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/api";

function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getMe(token)
      .then((res) => {
        // User object contains subscriptions array
        const subscribedChannels = res.data.subscriptions || [];
        setSubscriptions(subscribedChannels);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <div className="flex pt-14">
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-[72px]"
          } p-6`}
        >
          <h1 className="text-3xl font-bold mb-6">My Subscriptions</h1>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                You haven't subscribed to any channels yet
              </p>
              <button
                onClick={() => navigate("/trending")}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
              >
                Find Channels to Subscribe
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((channel) => (
                <div
                  key={channel._id}
                  className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/channel/${channel._id}`)}
                >
                  <div className="flex gap-4 items-center">
                    {/* Channel Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-2xl">
                        {channel.channelAvatar ? (
                          <img
                            src={channel.channelAvatar}
                            alt={channel.channelName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "📺"
                        )}
                      </div>
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {channel.channelName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {channel.subscribers || 0} subscribers
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {channel.description}
                      </p>
                    </div>

                    {/* Video Count */}
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {channel.videos?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        videos
                      </p>
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

export default MySubscriptions;
