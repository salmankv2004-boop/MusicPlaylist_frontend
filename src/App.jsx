import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";

import Playlists from "./Pages/Playlists";
import PlaylistSongs from "./Pages/PlaylistAddsong";
import Login from "./Pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:id" element={<PlaylistSongs />} />
      </Routes>
    </BrowserRouter>
  );
}
