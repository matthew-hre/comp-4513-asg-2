import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

import type { Tables } from "../types/database";

import supabase from "../lib/supabase";

type RelatedSong = {
  artist_id: null | number;
  artist_name: null | string;
  song_id: number;
  title: null | string;
};

const ANALYTIC_KEYS = ["danceability", "energy", "speechiness", "acousticness", "liveness", "valence"] as const;

export default function Song() {
  const { id } = useParams();
  const [song, setSong] = useState<null | Tables<"songs">>(null);
  const [artist, setArtist] = useState<null | Tables<"artists">>(null);
  const [genre, setGenre] = useState<null | Tables<"genres">>(null);
  const [relatedSongs, setRelatedSongs] = useState<RelatedSong[]>([]);
  const [loading, setLoading] = useState(true);

  const [playlists, setPlaylists] = useState<Tables<"playlist_names">[]>([]);
  const [toast, setToast] = useState<null | string>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("song_id", Number(id))
        .single();

      if (error || !data) {
        // eslint-disable-next-line no-console
        console.error("Error fetching song:", error);
        setLoading(false);
        return;
      }

      setSong(data);

      const [artistRes, genreRes] = await Promise.all([
        data.artist_id
          ? supabase.from("artists").select("*").eq("artist_id", data.artist_id).single()
          : null,
        data.genre_id
          ? supabase.from("genres").select("*").eq("genre_id", data.genre_id).single()
          : null,
      ]);

      if (artistRes?.data) setArtist(artistRes.data);
      if (genreRes?.data) setGenre(genreRes.data);

      const analytics = ANALYTIC_KEYS.map(key => ({
        key,
        value: data[key] ?? 0,
      })).sort((a, b) => b.value - a.value);

      const top3 = analytics.slice(0, 3);
      const targetSum = top3.reduce((sum, a) => sum + a.value, 0);

      const { data: allSongs } = await supabase
        .from("songs")
        .select("song_id, title, artist_id, danceability, energy, speechiness, acousticness, liveness, valence")
        .neq("song_id", Number(id));

      if (allSongs) {
        const withDiff = allSongs.map(s => {
          const sum = top3.reduce((acc, a) => acc + ((s as Record<string, unknown>)[a.key] as number ?? 0), 0);
          return { ...s, diff: Math.abs(sum - targetSum) };
        });

        withDiff.sort((a, b) => a.diff - b.diff);
        const closest = withDiff.slice(0, 8);

        const artistIds = [...new Set(closest.map(s => s.artist_id).filter(Boolean))];
        const { data: relArtists } = artistIds.length > 0
          ? await supabase.from("artists").select("artist_id, artist_name").in("artist_id", artistIds)
          : { data: [] };

        const artistMap = new Map((relArtists || []).map(a => [a.artist_id, a.artist_name]));

        setRelatedSongs(closest.map(s => ({
          artist_id: s.artist_id,
          artist_name: artistMap.get(s.artist_id!) ?? null,
          song_id: s.song_id,
          title: s.title,
        })));
      }

      setLoading(false);
    };

    fetchSong();
  }, [id]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlist_names")
        .select("playlist_id, name");
      setPlaylists(data || []);
    };

    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: number) => {
    if (!song) return;

    const playlistName = playlists.find(p => p.playlist_id === playlistId)?.name || "playlist";

    const { error } = await supabase
      .from("playlists")
      .insert({ playlist_id: playlistId, song_id: song.song_id });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding to playlist:", error);
      return;
    }

    dialogRef.current?.close();
    showToast(`Added "${song.title || "Untitled"}" to ${playlistName}`);
  };

  if (loading) {
    return <p aria-busy="true">Loading song...</p>;
  }

  if (!song) {
    return <p>Song not found.</p>;
  }

  const radarData = ANALYTIC_KEYS.map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value: song[key] ?? 0,
  }));

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: "1" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{song.title || "Untitled"}</h1>

          {artist && (
            <p style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
              <Link to={`/artists/${artist.artist_id}`}>
                <strong>{artist.artist_name}</strong>
              </Link>
            </p>
          )}

          <p style={{ marginBottom: "1.5rem" }}>{song.year}</p>

          {genre && (
            <p>
              <Link to={`/genres/${genre.genre_id}`}>
                {genre.genre_name}
              </Link>
            </p>
          )}

          <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <small>BPM</small>
              <p><strong>{song.bpm ?? "—"}</strong></p>
            </div>
            <div>
              <small>Popularity</small>
              <p><strong>{song.popularity ?? "—"}</strong></p>
            </div>
            <div>
              <small>Loudness</small>
              <p><strong>{song.loudness ?? "—"}</strong></p>
            </div>
          </div>

          <button
            onClick={() => dialogRef.current?.showModal()}
            type="button"
          >
            + Add to Playlist
          </button>
        </div>

        <div style={{ flex: "1" }}>
          {artist?.artist_image_url ? (
            <img
              alt={artist.artist_name || "Artist"}
              src={artist.artist_image_url}
              style={{ borderRadius: "var(--pico-border-radius)", maxWidth: "100%", width: "100%" }}
            />
          ) : (
            <div
              style={{
                alignItems: "center",
                aspectRatio: "1",
                background: "var(--pico-secondary-background)",
                borderRadius: "var(--pico-border-radius)",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <span>No image available</span>
            </div>
          )}
        </div>
      </div>

      <article style={{ marginTop: "2rem" }}>
        <header>
          <h2 style={{ marginBottom: 0 }}>Analytics</h2>
        </header>
        <ResponsiveContainer height={350} width="100%">
          <RadarChart data={radarData} outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <Radar
              dataKey="value"
              fill="var(--pico-primary)"
              fillOpacity={0.3}
              name="Analytics"
              stroke="var(--pico-primary)"
            />
          </RadarChart>
        </ResponsiveContainer>
      </article>

      <article>
        <header>
          <h2 style={{ marginBottom: 0 }}>Related Songs</h2>
        </header>
        {relatedSongs.length === 0 ? (
          <p><em>No related songs found.</em></p>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}>
            {relatedSongs.map(rs => (
              <article key={rs.song_id} style={{ marginBottom: 0 }}>
                <Link to={`/songs/${rs.song_id}`}>
                  <strong>{rs.title || "Untitled"}</strong>
                </Link>
                {rs.artist_name && (
                  <p style={{ marginBottom: 0 }}>
                    <small>
                      <Link to={`/artists/${rs.artist_id}`}>
                        {rs.artist_name}
                      </Link>
                    </small>
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </article>

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
    </div>
  );
}
