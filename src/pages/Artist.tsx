import { useEffect, useState } from "react";
import { useParams } from "react-router";

import SongList from "../components/SongList";
import supabase from "../lib/supabase";
import type { Tables } from "../types/database";

type ArtistSong = {
  artist_id: null | number;
  artist_name: null | string;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function Artist() {
  const { id } = useParams();
  const [artist, setArtist] = useState<null | Tables<"artists">>(null);
  const [artistType, setArtistType] = useState<null | string>(null);
  const [songs, setSongs] = useState<ArtistSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("artist_id", Number(id))
        .single();

      if (error || !data) {
        // eslint-disable-next-line no-console
        console.error("Error fetching artist:", error);
        setLoading(false);
        return;
      }

      setArtist(data);

      const [typeRes, songsRes] = await Promise.all([
        data.artist_type_id
          ? supabase.from("types").select("type_name").eq("type_id", data.artist_type_id).single()
          : null,
        supabase
          .from("songs")
          .select("song_id, title, year, artist_id")
          .eq("artist_id", Number(id))
          .order("title"),
      ]);

      if (typeRes?.data) setArtistType(typeRes.data.type_name);

      setSongs(
        (songsRes.data || []).map(s => ({
          artist_id: s.artist_id,
          artist_name: data.artist_name,
          song_id: s.song_id,
          title: s.title,
          year: s.year,
        }))
      );

      setLoading(false);
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return <p aria-busy="true">Loading artist...</p>;
  }

  if (!artist) {
    return <p>Artist not found.</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: "1" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{artist.artist_name || "Unknown Artist"}</h1>

          {artistType && (
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>{artistType}</strong>
            </p>
          )}

          {artist.spotify_desc && (
            <p>{artist.spotify_desc}</p>
          )}

          {artist.spotify_url && (
            <p>
              <a href={artist.spotify_url} rel="noopener noreferrer" target="_blank">
                View on Spotify ↗
              </a>
            </p>
          )}
        </div>

        <div style={{ flex: "1" }}>
          {artist.artist_image_url ? (
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
          <h2 style={{ marginBottom: 0 }}>Songs</h2>
        </header>
        <SongList songs={songs} />
      </article>
    </div>
  );
}
