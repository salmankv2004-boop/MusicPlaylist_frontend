import { useEffect, useState } from "react";
import API from "../API/axios";
import { toast } from "react-toastify";
import ImageCropper from "./ImageCropper";

export default function AllSongs() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [singerImage, setSingerImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null);

  // 🔹 FETCH SONGS
  const fetchSongs = async () => {
    try {
      const res = await API.get("/getallsong");
      setSongs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSongs([]);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // 🔹 FETCH PLAYLISTS
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await API.get("/getallPlaylist");
        setPlaylists(Array.isArray(res.data) ? res.data : []);
      } catch {
        setPlaylists([]);
      }
    };
    fetchPlaylists();
  }, []);

  // 🔹 UPLOAD SONG
  const handleUpload = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedArtist = artist.trim();

    if (!trimmedTitle || !trimmedArtist || !file) {
      return toast.error("All fields are required");
    }

    if (file.size > 8 * 1024 * 1024) {
      return toast.error("File too large (Max 8MB)");
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("artist", trimmedArtist);
      formData.append("audio", file);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (singerImage) formData.append("singerImage", singerImage);

      const res = await API.post("/uploadsong", formData);

      // instant UI update
      if (res.data?.song) {
        setSongs((prev) => [res.data.song, ...prev]);
      } else {
        fetchSongs();
      }

      toast.success("Song uploaded successfully 🎧");

      setTitle("");
      setArtist("");
      setFile(null);
      setThumbnail(null);
      setSingerImage(null);
      setUploadOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
        setCropType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = (croppedBlob) => {
    const croppedFile = new File([croppedBlob], "cropped_image.jpg", { type: "image/jpeg" });
    if (cropType === "thumbnail") setThumbnail(croppedFile);
    if (cropType === "singer") setSingerImage(croppedFile);
    setCropImage(null);
    setCropType(null);
  };

  const handleCropCancel = () => {
    setCropImage(null);
    setCropType(null);
  };

  // 🔹 OPEN PLAYLIST MODAL
  const openPlaylistModal = (songId) => {
    setSelectedSongId(songId);
    setPlaylistModalOpen(true);
  };

  // 🔹 ADD TO PLAYLIST (FINAL)
  const addToPlaylist = async (playlistId) => {
    if (!selectedSongId) return;

    try {
      await API.put(
        `/playlists/${playlistId}/add-song/${selectedSongId}`
      );

      toast.success("Song added to playlist 🎶");

      setPlaylistModalOpen(false);
      setSelectedSongId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add song"
      );
    }
  };

  // 🔹 DELETE SONG
  const deleteSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    try {
      await API.delete(`/delete/${id}`);
      setSongs((prev) => prev.filter((song) => song._id !== id));
      toast.success("Song deleted successfully 🗑️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete song");
    }
  };
  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400">
          All Songs
        </h2>
        <button
          onClick={() => setUploadOpen(true)}
          className="fixed sm:static bottom-6 right-6 sm:bottom-0 sm:right-0 z-40 bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 sm:px-5 sm:py-2 rounded-full font-bold shadow-2xl sm:shadow-lg hover:scale-110 active:scale-95 transform transition-all flex items-center gap-2"
        >
          <span className="text-xl sm:text-base">+</span>
          <span className="sm:inline">Add Song</span>
        </button>
      </div>

      {/* SONG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.length ? (
          songs.map((song) => (
            <div
              key={song._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              {song.thumbnail ? (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-xl mb-4 shadow-inner shadow-black/20"
                />
              ) : (
                <div className="w-full h-40 bg-gray-700 flex items-center justify-center rounded-xl mb-4 text-gray-500">
                  🎵 No Image
                </div>
              )}
              <h3 className="font-bold text-lg mb-1 text-yellow-400">{song.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                {song.singerImage ? (
                  <img
                    src={song.singerImage}
                    alt={song.artist}
                    className="w-8 h-8 rounded-full object-cover object-top border-2 border-pink-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                    🎤
                  </div>
                )}
                <p className="text-sm text-gray-300">{song.artist}</p>
              </div>

              {/* Audio Player */}
              <audio controls preload="none" className="w-full rounded">
                <source src={song.filepath} type="audio/mpeg" />
              </audio>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openPlaylistModal(song._id)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transform transition text-sm"
                >
                  Add to Playlist
                </button>
                <button
                  onClick={() => deleteSong(song._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow-md hover:scale-105 transform transition"
                  title="Delete Song"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">No songs available</p>
        )}
      </div>

      {/* 🔹 UPLOAD MODAL */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gradient-to-tr from-gray-800 via-gray-900 to-black p-5 sm:p-6 rounded-3xl w-[95%] max-w-md shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-purple-400">Upload Song</h3>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl font-bold"
              >
                ❌
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title"
                className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
                className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {/* Audio Upload */}
              <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-blue-500 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept=".mp3,audio/mpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-400">
                  <span className="text-2xl mb-1">🎵</span>
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to Upload MP3"}
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-pink-500 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "thumbnail")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-pink-400">
                  <span className="text-2xl mb-1">🖼️</span>
                  <p className="text-sm font-medium">
                    {thumbnail ? thumbnail.name : "Click to Set Cover Image"}
                  </p>
                </div>
              </div>

              {/* Singer Image Upload */}
              <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "singer")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-purple-400">
                  <span className="text-2xl mb-1">🎤</span>
                  <p className="text-sm font-medium">
                    {singerImage ? singerImage.name : "Click to Set Singer Face"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 PLAYLIST MODAL */}
      {playlistModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-tr from-gray-800 via-gray-900 to-black p-5 sm:p-6 rounded-3xl w-[95%] max-w-md shadow-2xl animate-slide-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-pink-400">Select Playlist</h3>
              <button
                onClick={() => setPlaylistModalOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl font-bold"
              >
                ❌
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {playlists.length ? (
                playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={() => addToPlaylist(pl._id)}
                    className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-left shadow-md transition transform hover:-translate-y-0.5"
                  >
                    {pl.title}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-center">No playlists available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 IMAGE CROPPER MODAL */}
      {cropImage && (
        <ImageCropper
          image={cropImage}
          aspect={1}
          onCropDone={handleCropDone}
          onCropCancel={handleCropCancel}
        />
      )}
    </div>
  );
}