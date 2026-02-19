import { useNavigate } from "react-router-dom";

export default function Navbar({ email }) {
  const navigate = useNavigate();

  return (
   <div className="p-4 flex justify-between items-center bg-[#1e1e2e] border-b border-white/10">
  <h1 className="text-xl font-bold text-green-400">
    music  
    
  </h1>

  <div className="flex items-center gap-4 text-gray-300">
    

    <button
      onClick={() => navigate("/playlists")}
      className="bg-[#2a2a40] px-4 py-1 rounded hover:bg-[#3a3a55]"
    >
      Playlists
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }}
      className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</div>

  );
}