import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import type { Tables } from "../types/database";

import supabase from "../lib/supabase";

type SongItem = {
  artist_id: null | number;
  artist_name: null | string;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function SongList({ songs }: { songs: SongItem[] }) {
  const [playlists, setPlaylists] = useState<Tables<"playlist_names">[]>([]);
  const [addingSongId, setAddingSongId] = useState<null | number>(null);
  const [toast, setToast] = useState<null | string>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlist_names")
        .select("playlist_id, name");
      setPlaylists(data || []);
    };

    fetchPlaylists();
  }, []);

  const openAddModal = (songId: number) => {
    setAddingSongId(songId);
    dialogRef.current?.showModal();
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    if (addingSongId == null) return;

    const songTitle = songs.find(s => s.song_id === addingSongId)?.title || "Untitled";
    const playlistName = playlists.find(p => p.playlist_id === playlistId)?.name || "playlist";

    const { error } = await supabase
      .from("playlists")
      .insert({ playlist_id: playlistId, song_id: addingSongId });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding to playlist:", error);
      return;
    }

    dialogRef.current?.close();
    setAddingSongId(null);
    setToast(`Added "${songTitle}" to ${playlistName}`);
    setTimeout(() => setToast(null), 3000);
  };

  if (songs.length === 0) {
    return <p><em>No songs found.</em></p>;
  }

  return (
    <>
      <table className="striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th style={{ width: "1%" }} />
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song.song_id}>
              <td>
                <Link to={`/songs/${song.song_id}`}>
                  {song.title || "Untitled"}
                </Link>
              </td>
              <td>
                <Link to={`/artists/${song.artist_id}`}>
                  {song.artist_name || "Unknown"}
                </Link>
              </td>
              <td>{song.year}</td>
              <td>
                <button
                  className="outline"
                  onClick={() => openAddModal(song.song_id)}
                  style={{ margin: 0, padding: "0.25rem 0.75rem" }}
                  type="button"
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogRef}>
        <article>
          <header>
            <button
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              rel="prev"
              type="button"
            />
            <h2>Add to Playlist</h2>
          </header>
          {playlists.length === 0 ? (
            <p><em>No playlists yet. Create one on the Playlists page.</em></p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {playlists.map(p => (
                <li key={p.playlist_id} style={{ marginBottom: "0.5rem" }}>
                  <button
                    className="outline"
                    onClick={() => handleAddToPlaylist(p.playlist_id)}
                    style={{ width: "100%" }}
                    type="button"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </dialog>

      {toast && (
        <div
          role="alert"
          style={{
            background: "var(--pico-primary-background)",
            borderRadius: "var(--pico-border-radius)",
            bottom: "1rem",
            color: "var(--pico-primary-inverse)",
            padding: "0.75rem 1.5rem",
            position: "fixed",
            right: "1rem",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
