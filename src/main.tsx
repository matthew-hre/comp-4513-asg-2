import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App";
import "./index.scss";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./lib/ProtectedRoute";
import Artist from "./pages/Artist";
import Artists from "./pages/Artists";
import Genre from "./pages/Genre";
import Genres from "./pages/Genres";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import Song from "./pages/Song";
import Songs from "./pages/Songs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route element={<Home />} index />
            <Route element={<ProtectedRoute element={<Songs />} />} path="songs" />
            <Route element={<ProtectedRoute element={<Song />} />} path="songs/:id" />
            <Route element={<ProtectedRoute element={<Artists />} />} path="artists" />
            <Route element={<ProtectedRoute element={<Artist />} />} path="artists/:id" />
            <Route element={<ProtectedRoute element={<Genres />} />} path="genres" />
            <Route element={<ProtectedRoute element={<Genre />} />} path="genres/:id" />
            <Route element={<Login />} path="login" />
            <Route element={<ProtectedRoute element={<Playlists />} />} path="playlists" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
