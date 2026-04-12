import { useEffect, useState } from "react";
import { Link } from "react-router";

import supabase from "../lib/supabase";

type Playlist = {
  name: string;
  playlist_id: number;
  songCount: number;
};

type PlaylistSong = {
  artist_id: null | number;
  artist_name: null | string;
  id: number;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<null | number>(null);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [songsLoading, setSongsLoading] = useState(false);
  const [toast, setToast] = useState<null | string>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [songsRefreshKey, setSongsRefreshKey] = useState(0);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      const { data: names, error: namesError } = await supabase
        .from("playlist_names")
        .select("playlist_id, name");

      if (namesError) {
        // eslint-disable-next-line no-console
        console.error("Error fetching playlists:", namesError);
        setLoading(false);
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from("playlists")
        .select("playlist_id, song_id");

      if (entriesError) {
        // eslint-disable-next-line no-console
        console.error("Error fetching playlist entries:", entriesError);
        setLoading(false);
        return;
      }

      const counts: Record<number, number> = {};
      for (const entry of entries || []) {
        if (entry.playlist_id != null) {
          counts[entry.playlist_id] = (counts[entry.playlist_id] || 0) + 1;
        }
      }

      setPlaylists(
        (names || []).map(p => ({
          name: p.name,
          playlist_id: p.playlist_id,
          songCount: counts[p.playlist_id] || 0,
        }))
      );
      setLoading(false);
    };

    fetchPlaylists();
  }, [refreshKey]);

  useEffect(() => {
    if (selectedPlaylistId == null) {
      return;
    }

    const fetchSongs = async () => {
      setSongsLoading(true);
      const { data, error } = await supabase
        .from("playlists")
        .select("id, song_id, songs(title, year, artist_id, artists(artist_name))")
        .eq("playlist_id", selectedPlaylistId);

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching playlist songs:", error);
        setSongsLoading(false);
        return;
      }

      setSongs(
        (data || [])
          .filter(row => row.song_id != null)
          .map(row => {
            const song = row.songs as unknown as {
              artist_id: null | number;
              artists: null | { artist_name: null | string };
              title: null | string;
              year: null | number;
            };
            return {
              artist_id: song?.artist_id ?? null,
              artist_name: song?.artists?.artist_name ?? null,
              id: row.id,
              song_id: row.song_id!,
              title: song?.title ?? null,
              year: song?.year ?? null,
            };
          })
      );
      setSongsLoading(false);
    };

    fetchSongs();
  }, [selectedPlaylistId, songsRefreshKey]);

  const handleCreatePlaylist = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const { error } = await supabase
      .from("playlist_names")
      .insert({ name: trimmed });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error creating playlist:", error);
      return;
    }

    setNewName("");
    setRefreshKey(k => k + 1);
    showToast(`Created playlist "${trimmed}"`);
  };

  const handleDeletePlaylist = async (playlistId: number, name: string) => {
    await supabase
      .from("playlists")
      .delete()
      .eq("playlist_id", playlistId);

    await supabase
      .from("playlist_names")
      .delete()
      .eq("playlist_id", playlistId);

    if (selectedPlaylistId === playlistId) {
      setSongs([]);
      setSelectedPlaylistId(null);
    }

    setRefreshKey(k => k + 1);
    showToast(`Deleted playlist "${name}"`);
  };

  const handleRemoveSong = async (entryId: number, title: null | string) => {
    const { error } = await supabase
      .from("playlists")
      .delete()
      .eq("id", entryId);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error removing song:", error);
      return;
    }

    showToast(`Removed "${title || "Untitled"}" from playlist`);

    if (selectedPlaylistId != null) {
      setSongsRefreshKey(k => k + 1);
      setRefreshKey(k => k + 1);
    }
  };

  const selectedPlaylist = playlists.find(p => p.playlist_id === selectedPlaylistId);

  return (
    <div>
      <h1>Playlists</h1>

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

      {loading ? (
        <p aria-busy="true">Loading playlists...</p>
      ) : (
        <article>
          <table className="striped">
            <thead>
              <tr>
                <th>Name</th>
                <th># Songs</th>
                <th style={{ width: "1%" }} />
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <em>No playlists yet. Create one below.</em>
                  </td>
                </tr>
              ) : (
                playlists.map(p => (
                  <tr
                    key={p.playlist_id}
                    onClick={() => setSelectedPlaylistId(p.playlist_id)}
                    style={{
                      background: selectedPlaylistId === p.playlist_id
                        ? "var(--pico-primary-focus)"
                        : undefined,
                      cursor: "pointer",
                    }}
                  >
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.songCount}</td>
                    <td>
                      <button
                        className="secondary outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(p.playlist_id, p.name);
                        }}
                        style={{ margin: 0, padding: "0.25rem 0.75rem" }}
                        type="button"
                      >
                        −
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreatePlaylist();
            }}
          >
            <fieldset role="group">
              <input
                id="new-playlist-name"
                onChange={e => setNewName(e.target.value)}
                placeholder="New playlist name..."
                type="text"
                value={newName}
              />
              <input type="submit" value="+" />
            </fieldset>
          </form>
        </article>
      )}

      {selectedPlaylist && (
        <article>
          <header>
            <h2 style={{ marginBottom: 0 }}>{selectedPlaylist.name}</h2>
          </header>
          {songsLoading ? (
            <p aria-busy="true">Loading songs...</p>
          ) : songs.length === 0 ? (
            <p><em>No songs in this playlist.</em></p>
          ) : (
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
                  <tr key={song.id}>
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
                        className="secondary outline"
                        onClick={() => handleRemoveSong(song.id, song.title)}
                        style={{ margin: 0, padding: "0.25rem 0.75rem" }}
                        type="button"
                      >
                        −
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      )}
    </div>
  );
}
