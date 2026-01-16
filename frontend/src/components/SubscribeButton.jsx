import { useState } from "react";
import { subscribeChannel, unsubscribeChannel } from "../services/api";

function SubscribeButton({ channelId, isSubscribed = false, onSubscribe }) {
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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
      className={`px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
        subscribed
          ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
          : "bg-red-600 text-white hover:bg-red-700"
      } disabled:opacity-50`}
    >
      {loading ? "..." : subscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}

export default SubscribeButton;
