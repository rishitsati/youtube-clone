import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaYoutube, FaSearch, FaBars, FaMicrophone, FaVideo, FaBell, FaUser, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import api from "../services/api";

function Header({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);

  const isLoggedIn = localStorage.getItem("token");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search/${search}`);
      setSuggestions([]);
      setShowSuggestions(false);
      setSearch("");
    }
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const res = await api.get(`/videos`);
        const filtered = res.data.filter(v => 
          v.title.toLowerCase().includes(e.target.value.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/search/${title}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setProfileMenu(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && 
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileMenu && !e.target.closest('[data-profile-menu]')) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenu]);

  return (
    <header className="bg-yt-dark border-b border-yt-hover sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between px-4 h-14 gap-4">
        
        {/* LEFT: Hamburger + Logo */}
        <div className="flex items-center gap-3 min-w-fit">
          <button 
            className="p-2 hover:bg-yt-hover rounded-full transition-colors"
            title="Menu"
          >
            <FaBars className="text-xl text-yt-text" />
          </button>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FaYoutube className="text-yt-red text-2xl" />
            <span className="text-xl font-bold text-yt-text hidden sm:inline">YouTube</span>
          </Link>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-md relative">
          <form onSubmit={handleSearch} className="flex items-center bg-yt-bg border border-yt-hover hover:border-yt-secondary rounded-full transition-colors">
            <input
              ref={searchInputRef}
              className="flex-1 px-4 py-2 bg-transparent text-yt-text placeholder-yt-secondary outline-none text-sm"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => search && setShowSuggestions(true)}
            />
            <button 
              type="submit" 
              className="px-4 py-2 hover:bg-yt-hover transition-colors"
              title="Search"
            >
              <FaSearch className="text-yt-secondary text-sm" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-yt-bg border border-yt-hover rounded-lg shadow-xl max-h-64 overflow-y-auto"
            >
              {suggestions.map((video) => (
                <button
                  key={video._id}
                  onClick={() => handleSuggestionClick(video.title)}
                  className="w-full px-4 py-3 hover:bg-yt-hover text-left text-yt-text hover:text-yt-red transition-colors flex items-center gap-2 border-b border-yt-hover last:border-b-0"
                >
                  <FaSearch className="text-xs text-yt-secondary" />
                  <span className="truncate text-sm">{video.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Microphone (hidden on mobile) */}
        <button 
          className="p-2 hover:bg-yt-hover rounded-full transition-colors hidden sm:flex"
          title="Search with your voice"
        >
          <FaMicrophone className="text-yt-text text-lg" />
        </button>

        {/* RIGHT: Upload + Notifications + Profile */}
        <div className="flex items-center gap-2">
          
          {/* Upload Button */}
          {isLoggedIn && (
            <Link 
              to="/upload" 
              className="p-2 hover:bg-yt-hover rounded-full transition-colors hidden sm:flex"
              title="Create"
            >
              <FaVideo className="text-yt-text text-lg" />
            </Link>
          )}

          {/* Notifications */}
          {isLoggedIn && (
            <button 
              className="p-2 hover:bg-yt-hover rounded-full transition-colors relative hidden sm:flex"
              title="Notifications"
            >
              <FaBell className="text-yt-text text-lg" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yt-red rounded-full"></span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-yt-hover rounded-full transition-colors"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? (
              <FaSun className="text-lg text-yellow-400" />
            ) : (
              <FaMoon className="text-lg text-yt-secondary" />
            )}
          </button>

          {/* Profile / Sign In */}
          {isLoggedIn ? (
            <div data-profile-menu className="relative">
              <button
                onClick={() => setProfileMenu(!profileMenu)}
                className="p-2 hover:bg-yt-hover rounded-full transition-colors"
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-yt-hover flex items-center justify-center">
                  <FaUser className="text-yt-secondary text-sm" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-yt-bg border border-yt-hover rounded-lg shadow-xl overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenu(false)}
                    className="block px-4 py-2 text-yt-text hover:bg-yt-hover transition-colors border-b border-yt-hover"
                  >
                    Your profile
                  </Link>
                  <Link
                    to="/my-channel"
                    onClick={() => setProfileMenu(false)}
                    className="block px-4 py-2 text-yt-text hover:bg-yt-hover transition-colors border-b border-yt-hover"
                  >
                    Your channel
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-yt-text hover:bg-yt-hover transition-colors flex items-center gap-2"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 border border-yt-red text-yt-red hover:bg-yt-red hover:text-yt-dark rounded-full font-semibold transition-colors text-sm hidden sm:block"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
