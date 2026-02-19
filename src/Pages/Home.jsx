import { useEffect, useState } from "react";
import API from "../API/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import SongCard from "../components/SongCard";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/getProfile")
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/getProfile"));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar email={user.email} />
      <SongCard/>
    </div>
  );
}