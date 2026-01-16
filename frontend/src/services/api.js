import axios from "axios";

const api = axios.create({
  baseURL: "https://youtube-clone-backend-co6r.onrender.com/api",
});

export default api;
