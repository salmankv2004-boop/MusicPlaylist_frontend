import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://music-playlist-backend.vercel.app"
      : "http://localhost:3000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;