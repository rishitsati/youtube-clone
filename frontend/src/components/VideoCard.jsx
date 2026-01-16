import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate(`/video/${video._id}`)}>
      <img src={video.thumbnailUrl} alt={video.title} style={styles.thumb} />
      <h4>{video.title}</h4>
      <p>{video.channel?.channelName}</p>
      <p>{video.views} views</p>
    </div>
  );
}

const styles = {
  card: {
    width: "250px",
    margin: "10px",
    cursor: "pointer",
  },
  thumb: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
};

export default VideoCard;
