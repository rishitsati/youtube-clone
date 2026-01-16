import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/videos").then((res) => {
      const found = res.data.find((v) => v._id === id);
      setVideo(found);
    });

    api.get(`/comments/${id}`).then((res) => {
      setComments(res.data);
    });
  }, [id]);

  const like = async () => {
    const res = await api.put(
      `/videos/${id}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setVideo(res.data);
  };

  const addComment = async () => {
    const res = await api.post(
      "/comments",
      {
        text,
        videoId: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setComments([...comments, res.data]);
    setText("");
  };

  if (!video) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <video width="800" controls src={video.videoUrl}></video>
        <h2>{video.title}</h2>
        <p>{video.description}</p>

        <button onClick={like}>👍 {video.likes}</button>

        <h3>Comments</h3>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment"
        />
        <button onClick={addComment}>Post</button>

        {comments.map((c) => (
          <p key={c._id}>
            <b>{c.user?.username}</b>: {c.text}
          </p>
        ))}
      </div>
    </>
  );
}

export default Video;
