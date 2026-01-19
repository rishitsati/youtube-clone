import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { Search as SearchIcon, YoutubeIcon } from "lucide-react";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "./components/ui/sidebar";

import { AppSidebar } from "./pages/components/AppSidebar";
import Video from "./pages/Video";
import Login from "./pages/Login";
import Channel from "./pages/Channel";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import WatchHistory from "./pages/WatchHistory";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import MyChannel from "./pages/MyChannel";
import MySubscriptions from "./pages/MySubscriptions";
import Signup from "./pages/Signup";

// Search Bar Component
function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL if on search page
  useEffect(() => {
    if (location.pathname.startsWith("/search/")) {
      const query = decodeURIComponent(location.pathname.split("/search/")[1] || "");
      setSearch(query);
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full px-4 py-2.5 pl-10 bg-gray-800 dark:bg-gray-900 text-white placeholder-gray-400 rounded-lg outline-none border border-gray-700 dark:border-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-700 transition-colors"
          aria-label="Search"
        >
          <SearchIcon
            className="text-gray-400 hover:text-white"
            size={18}
          />
        </button>
      </div>
    </form>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setDarkMode(savedTheme === "dark");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 items-center gap-4 border-b border-gray-800 dark:border-gray-700 px-4 bg-white dark:bg-black">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-white dark:text-white hidden sm:block">
              <YoutubeIcon className="text-red-800"/>
              </h1>
            </div>
            <SearchBar />
          </header>

          <main className="p-4 bg-white dark:bg-black min-h-screen">
            <Routes>
              <Route
                path="/"
                element={
                  <Home toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                }
              />
              <Route path="/video/:id" element={<Video />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/watch-history"
                element={
                  <WatchHistory
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/playlists"
                element={
                  <Playlists
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/playlist/:id"
                element={
                  <PlaylistDetail
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/my-channel"
                element={
                  <MyChannel
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/my-subscriptions"
                element={
                  <MySubscriptions
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
            </Routes>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
