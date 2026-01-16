import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Channel from "./pages/Channel";
import Video from "./pages/Video";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import WatchHistory from "./pages/WatchHistory";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import MyChannel from "./pages/MyChannel";
import MySubscriptions from "./pages/MySubscriptions";

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
    <div className="bg-white dark:bg-black">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/channel/:id" element={<Channel />} />
          <Route path="/video/:id" element={<Video />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/watch-history"
            element={
              <WatchHistory toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            }
          />
          <Route
            path="/playlists"
            element={
              <Playlists toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <PlaylistDetail toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            }
          />
          <Route
            path="/my-channel"
            element={
              <MyChannel toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            }
          />
          <Route
            path="/my-subscriptions"
            element={
              <MySubscriptions toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
