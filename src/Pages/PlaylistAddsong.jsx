import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../API/axios";

export default function PlaylistAddsong() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null); // Track playing song
  const [allSongs, setAllSongs] = useState([]); // Recommended songs
  const [search, setSearch] = useState("");


  // 🔹 Fetch Playlist
  const fetchPlaylist = async () => {
    try {
      const res = await API.get(`/getplaylistbyid/${id}`);
      const pl = res.data.playlist || res.data;
      setPlaylist(pl);
      setSongs(Array.isArray(pl.songs) ? pl.songs : []);
    } catch (error) {
      console.error("Fetch playlist failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  // 🔹 Fetch All Songs (for recommendations)
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const res = await API.get("/getallsong");
        setAllSongs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Fetch all songs failed", error);
      }
    };
    fetchAllSongs();
  }, []);

  // 🔹 Add Song to Playlist
  const addSongToPlaylist = async (songId) => {
    try {
      await API.put(`/playlists/${id}/add-song/${songId}`);

      // Update local state: move song from recommended to playlist
      const songToAdd = allSongs.find(s => s._id === songId);
      if (songToAdd) {
        setSongs(prev => [...prev, songToAdd]);
      }
    } catch (error) {
      console.error("Add song failed", error);
      alert("Failed to add song");
    }
  };

  // 🔹 Remove Song
  const removeSong = async (songId) => {
    if (!window.confirm("Remove this song from playlist?")) return;

    try {
      await API.put(`/playlists/${id}/remove-song/${songId}`);
      setSongs((prev) => prev.filter((song) => song._id !== songId));
    } catch (error) {
      console.error("Remove song failed", error);
      alert("Failed to remove song");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white font-sans">

      {/* 🔹 Back Button */}
      <button
        onClick={() => navigate("/playlists")}
        className="absolute top-6 left-6 z-10 bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
      >
        ⬅
      </button>

      {/* 🔹 Playlist Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 bg-gradient-to-b from-gray-700/50 to-gray-900/50 pt-20 text-center sm:text-left">
        {/* Playlist Cover Art Placeholder */}
        <div className="w-40 h-40 sm:w-52 sm:h-52 shadow-2xl shadow-black/50 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
          <span className="text-5xl sm:text-6xl">🎵</span>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">{playlist?.title}</h1>
          <p className="text-gray-300 text-sm font-medium mt-2">
            {songs.length} songs
          </p>
        </div>
      </div>

      {/* 🔹 Controls */}
      <div className="p-6 flex items-center gap-4">
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 hover:bg-green-400 transition text-black pl-1 shadow-lg shadow-green-500/20">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* 🔹 Song List Table */}
      <div className="px-4 sm:px-6 pb-20">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-2 sm:gap-4 text-gray-400 border-b border-gray-800 pb-2 px-2 sm:px-4 text-[10px] sm:text-sm font-medium uppercase tracking-wider">
          <div className="w-6 sm:w-8 text-center">#</div>
          <div>Title</div>
          <div className="hidden sm:block">Artist</div>
          <div className="text-right">Action</div>
        </div>

        {/* Songs */}
        <div className="mt-2 flex flex-col">
          {songs.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No songs in this playlist yet.</p>
          ) : (
            songs.map((song, index) => (
              <div
                key={song._id || index}
                className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-2 sm:gap-4 items-center p-2 sm:p-3 rounded-lg hover:bg-white/10 transition cursor-default"
              >
                {/* Number / Play Icon on Hover */}
                <div className="w-8 text-center text-gray-400 relative">
                  <span className="group-hover:opacity-0 transition-opacity duration-200">{index + 1}</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white transition-opacity duration-200">
                    ▶
                  </span>
                </div>

                {/* Title & Thumbnail */}
                <div className="flex items-center gap-4 overflow-hidden">
                  {song.thumbnail ? (
                    <img src={song.thumbnail} alt="" className="w-10 h-10 rounded shadow-md object-contain bg-black/40" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700/50 rounded flex items-center justify-center text-xs">🎵</div>
                  )}
                  <div className="flex flex-col truncate">
                    <span className="text-white font-medium truncate">{song.title}</span>
                    <span className="text-gray-400 text-xs sm:hidden">{song.artist}</span>
                  </div>
                </div>

                {/* Artist (Desktop) */}
                <div className="text-gray-400 text-sm hidden sm:block truncate hover:text-white transition">
                  {song.artist}
                </div>

                {/* Actions / Player */}
                <div className="flex items-center justify-end gap-4 min-w-[150px]">
                  {/* Inline Player */}
                  {song.filepath && (
                    <audio
                      controls
                      className="h-8 w-24 sm:w-32 md:w-40 opacity-50 hover:opacity-100 transition"
                      src={song.filepath}
                    />
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeSong(song._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition px-2"
                    title="Remove from playlist"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Recommended Songs Section */}
      <div className="px-6 pb-20 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-white">Recommended Songs</h2>
        <input
          placeholder="Search for songs..."
          className="bg-[#282828] text-white p-3 rounded-md w-full max-w-md mb-6 outline-none focus:ring-2 focus:ring-green-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          {allSongs
            .filter(song => !songs.some(s => s._id === song._id)) // Exclude songs already in playlist
            .filter(song => song.title.toLowerCase().includes(search.toLowerCase())) // Filter by search
            .slice(0, 10) // Limit to 10 suggestions
            .map((song) => (
              <div
                key={song._id}
                className="flex items-center justify-between bg-[#181818] p-3 rounded-md hover:bg-[#282828] transition group"
              >
                <div className="flex items-center gap-4">
                  {song.thumbnail ? (
                    <img src={song.thumbnail} alt="" className="w-12 h-12 rounded object-contain bg-black/40" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 flex items-center justify-center rounded">🎵</div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white">{song.title}</h4>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </div>

                <button
                  onClick={() => addSongToPlaylist(song._id)}
                  className="bg-transparent border border-gray-500 text-white px-4 py-1 rounded-full text-sm font-bold hover:border-white hover:scale-105 transition"
                >
                  Add
                </button>
              </div>
            ))}

          {allSongs.filter(song => !songs.some(s => s._id === song._id)).length === 0 && (
            <p className="text-gray-500">No more songs available to add.</p>
          )}
        </div>
      </div>
    </div>
  );
}