import React,{ useState, useEffect } from "react";
import { subscribeChannel, unsubscribeChannel } from "@/api/api";

function SubscribeButton({ channelId, isSubscribed = false, onSubscribe }) {
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    setSubscribed(isSubscribed);
  }, [isSubscribed]);

  const handleSubscribe = async () => {
    if (!token) {
      alert("Please login to subscribe");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (subscribed) {
        await unsubscribeChannel(channelId, token);
        setSubscribed(false);
      } else {
        await subscribeChannel(channelId, token);
        setSubscribed(true);
      }
      onSubscribe?.();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-semibold transition-colors whitespace-nowrap text-sm ${
        subscribed
          ? "bg-yt-hover text-yt-text hover:bg-yt-hover/80"
          : "bg-yt-red text-white hover:bg-red-700"
      } disabled:opacity-50`}
    >
      {loading ? "..." : subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}

export default SubscribeButton;
