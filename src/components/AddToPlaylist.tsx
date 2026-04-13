import { useEffect, useRef, useState } from "react";

import type { Tables } from "../types/database";

import { useAuth } from "../lib/auth";
import supabase from "../lib/supabase";
import Toast from "./Toast";

type PlaylistOption = Pick<Tables<"playlist_names">, "name" | "playlist_id">;

interface AddToPlaylistProps {
  onAdded?: () => void;
  songId: number;
  songTitle: string;
}

export default function AddToPlaylist({ onAdded, songId, songTitle }: AddToPlaylistProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistOption[]>([]);
  const [toast, setToast] = useState<null | string>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlist_names")
        .select("playlist_id, name");
      setPlaylists((data || []) as PlaylistOption[]);
    };

    fetchPlaylists();
  }, []);

  if (!user) return null;

  const handleAdd = async (playlistId: number) => {
    const playlistName = playlists.find(p => p.playlist_id === playlistId)?.name || "playlist";

    const { error } = await supabase
      .from("playlists")
      .insert({ playlist_id: playlistId, song_id: songId });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding to playlist:", error);
      return;
    }

    dialogRef.current?.close();
    setToast(`Added "${songTitle}" to ${playlistName}`);
    setTimeout(() => setToast(null), 3000);
    onAdded?.();
  };

  return (
    <>
      <button
        className="outline"
        onClick={() => dialogRef.current?.showModal()}
        style={{ margin: 0, padding: "0.25rem 0.75rem" }}
        type="button"
      >
        +
      </button>

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
                    onClick={() => handleAdd(p.playlist_id)}
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

      {toast && <Toast message={toast} />}
    </>
  );
}
