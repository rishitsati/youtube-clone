import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import api from "../services/api";

function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get("/videos").then((res) => {
      setVideos(res.data);
    });
  }, []);

  return (
    <>
      <Header />
      <div style={styles.grid}>
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    padding: "20px",
  },
};

export default Home;
