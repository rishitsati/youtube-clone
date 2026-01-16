import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFire, FaTv, FaHistory, FaClock, FaThumbsUp, FaList, FaPlay, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from "react";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const [expandSubscriptions, setExpandSubscriptions] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && expandSubscriptions) {
      // Fetch subscriptions from API later
      // For now, we'll use a placeholder
    }
  }, [expandSubscriptions, token]);

  const isActive = (path) => location.pathname === path;

  const mainMenu = [
    { id: 1, label: "Home", icon: FaHome, path: "/" },
    { id: 2, label: "Trending", icon: FaFire, path: "/trending" },
    { id: 3, label: "Subscriptions", icon: FaTv, path: "/my-subscriptions" },
  ];

  const yourLibrary = [
    { id: 4, label: "Your channel", icon: FaPlay, path: "/my-channel" },
    { id: 5, label: "History", icon: FaHistory, path: "/watch-history" },
    { id: 6, label: "Watch later", icon: FaClock, path: "/" },
    { id: 7, label: "Liked videos", icon: FaThumbsUp, path: "/" },
    { id: 8, label: "Playlists", icon: FaList, path: "/playlists" },
  ];

  return (
    <aside className={`fixed left-0 top-14 h-[calc(100vh-56px)] bg-yt-dark border-r border-yt-hover overflow-y-auto transition-all duration-300 z-40 ${
      isOpen ? "w-64" : "w-0 hidden"
    }`}>
      <nav className="py-2">
        
        {/* Main Menu */}
        <div className="space-y-1 pb-3 border-b border-yt-hover">
          {mainMenu.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-yt-hover text-yt-red"
                  : "text-yt-secondary hover:text-yt-text hover:bg-yt-hover"
              }`}
            >
              <item.icon className="text-lg flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* You Section */}
        <div className="py-3 border-b border-yt-hover">
          <p className="px-3 text-xs font-bold text-yt-secondary uppercase tracking-wider mb-2">
            You
          </p>
          <div className="space-y-1">
            {yourLibrary.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-yt-hover text-yt-red"
                    : "text-yt-secondary hover:text-yt-text hover:bg-yt-hover"
                }`}
              >
                <item.icon className="text-lg flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Subscriptions Section */}
        {token && (
          <div className="py-3 border-b border-yt-hover">
            <button
              onClick={() => setExpandSubscriptions(!expandSubscriptions)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-yt-secondary uppercase tracking-wider hover:text-yt-text transition-colors"
            >
              <span>Subscriptions</span>
              {expandSubscriptions ? (
                <FaChevronUp className="text-xs" />
              ) : (
                <FaChevronDown className="text-xs" />
              )}
            </button>

            {expandSubscriptions && (
              <div className="space-y-1 mt-2">
                <div className="px-3 py-2 text-sm text-yt-secondary text-center">
                  No subscriptions yet
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 space-y-2 border-t border-yt-hover">
          <a href="#" className="text-xs text-yt-secondary hover:text-yt-text transition-colors block">
            About
          </a>
          <a href="#" className="text-xs text-yt-secondary hover:text-yt-text transition-colors block">
            Press
          </a>
          <a href="#" className="text-xs text-yt-secondary hover:text-yt-text transition-colors block">
            Copyright
          </a>
          <a href="#" className="text-xs text-yt-secondary hover:text-yt-text transition-colors block">
            Contact us
          </a>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
