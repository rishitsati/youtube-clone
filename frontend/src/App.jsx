import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Video from "./pages/Video";
import Channel from "./pages/Channel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/video/:id" element={<Video />} />
        <Route path="/channel/:id" element={<Channel />} />
      </Routes>
    </Router>
  );
}

export default App;
