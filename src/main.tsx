import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App";
import "./index.scss";
import { AuthProvider } from "./lib/auth";
import Artist from "./pages/Artist";
import Artists from "./pages/Artists";
import Songs from "./pages/Songs";
import Genre from "./pages/Genre";
import Genres from "./pages/Genres";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import Song from "./pages/Song";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route element={<Home />} index />
            <Route element={<Songs />} path="songs" />
            <Route element={<Song />} path="songs/:id" />
            <Route element={<Artists />} path="artists" />
            <Route element={<Artist />} path="artists/:id" />
            <Route element={<Genres />} path="genres" />
            <Route element={<Genre />} path="genres/:id" />
            <Route element={<Login />} path="login" />
            <Route element={<Playlists />} path="playlists" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
