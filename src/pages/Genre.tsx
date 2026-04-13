import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { Tables } from "../types/database";

import SongList from "../components/SongList";
import supabase from "../lib/supabase";

type SongWithArtist = {
  artist_id: null | number;
  artist_name: null | string;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function Genre() {
  const { id } = useParams();
  const [genre, setGenre] = useState<null | Tables<"genres">>(null);
  const [songs, setSongs] = useState<SongWithArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("genres")
        .select("*")
        .eq("genre_id", Number(id))
        .single();

      if (error || !data) {
        // eslint-disable-next-line no-console
        console.error("Error fetching genre:", error);
        setLoading(false);
        return;
      }

      setGenre(data);

      const { data: songsData } = await supabase
        .from("songs")
        .select("song_id, title, year, artist_id, artists(artist_name)")
        .eq("genre_id", Number(id))
        .order("title");

      setSongs(
        (songsData || []).map(s => ({
          artist_id: s.artist_id,
          artist_name: (s.artists as { artist_name: null | string } | null)?.artist_name ?? null,
          song_id: s.song_id,
          title: s.title,
          year: s.year,
        }))
      );

      setLoading(false);
    };

    fetchGenre();
  }, [id]);

  if (loading) {
    return <p aria-busy="true">Loading genre...</p>;
  }

  if (!genre) {
    return <p>Genre not found.</p>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem" }}>{genre.genre_name || "Unknown Genre"}</h1>

      <article style={{ marginTop: "2rem" }}>
        <header>
          <h2 style={{ marginBottom: 0 }}>Songs</h2>
        </header>
        <SongList songs={songs} />
      </article>
    </div>
  );
}
