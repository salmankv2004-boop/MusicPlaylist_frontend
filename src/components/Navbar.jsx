import { useNavigate } from "react-router-dom";

export default function Navbar({ email }) {
  const navigate = useNavigate();

  return (
    <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center bg-[#1e1e2e] border-b border-white/10 gap-3 sm:gap-0">
      <h1 className="text-xl font-bold text-green-400">
        TuneFlow
      </h1>

      <div className="flex items-center gap-2 sm:gap-4 text-gray-300">
        <button
          onClick={() => navigate("/playlists")}
          className="bg-[#2a2a40] px-3 sm:px-4 py-1.5 rounded-lg hover:bg-[#3a3a55] text-sm sm:text-base transition-colors"
        >
          Playlists
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-red-500 px-3 sm:px-4 py-1.5 rounded-lg hover:bg-red-600 text-sm sm:text-base transition-colors font-semibold"
        >
          Logout
        </button>
      </div>
    </div>

  );
}