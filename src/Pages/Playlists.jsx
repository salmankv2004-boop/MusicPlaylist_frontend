import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/axios";

export default function Playlists() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔹 FETCH PLAYLISTS
  const fetchPlaylists = async () => {
    try {
      const res = await API.get("/getallPlaylist");
      setPlaylists(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch playlists failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 🔹 CREATE PLAYLIST
  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      const res = await API.post("/createplaylist", { title });
      const newPlaylist = res.data.playlist || res.data;

      setPlaylists((prev) => [newPlaylist, ...prev]);
      setTitle("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create playlist failed", err);
      alert("Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  // 🔹 REMOVE PLAYLIST
  const removePlaylist = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this playlist?")) return;

    try {
      await API.delete(`/dltplaylists/${id}`);
      setPlaylists((prev) => prev.filter((pl) => pl._id !== id));
    } catch (err) {
      console.log("Delete playlist failed", err);
      alert("Failed to delete playlist");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-8">

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Your Library</h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-400 hover:text-white transition font-bold"
          >
            Home
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black px-4 py-2 rounded-full font-bold hover:scale-105 transition"
          >
            + Create Playlist
          </button>
        </div>
      </div>

      {/* 🔹 PLAYLIST GRID */}
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-lg">No playlists yet</p>
          <button onClick={() => setShowCreateModal(true)} className="text-white mt-4 underline">Create one</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((pl) => (
            <div
              key={pl._id}
              onClick={() => navigate(`/playlists/${pl._id}`)}
              className="group bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition duration-300 cursor-pointer relative"
            >
              {/* Cover Placeholder */}
              <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4 shadow-lg flex items-center justify-center relative">
                <span className="text-4xl">🎵</span>

                {/* Delete Button (Hidden) */}
                <button
                  onClick={(e) => removePlaylist(pl._id, e)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                  title="Delete Playlist"
                >
                  ✖
                </button>

                {/* Play Button (Fake) */}
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  ▶
                </div>
              </div>

              <h3 className="font-bold text-white truncate">{pl.title}</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                By You • {pl.songs?.length || 0} songs
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 CREATE PLAYLIST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-8 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-center">Create Playlist</h3>

            <form onSubmit={createPlaylist} className="flex flex-col gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Playlist"
                className="bg-[#3E3E3E] text-white p-3 rounded-md border text-sm border-transparent focus:border-gray-500 outline-none placeholder-gray-400"
                autoFocus
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-white hover:text-gray-300 font-bold px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-full transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}