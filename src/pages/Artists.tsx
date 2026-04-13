import { useEffect, useState } from "react";

import type { Tables } from "../types/database";

import ArtistCard from "../components/ArtistCard";
import supabase from "../lib/supabase";

export default function Artists() {
  const [artists, setArtists] = useState<Tables<"artists">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("artist_name");

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching artists:", error);
      } else {
        setArtists(data || []);
      }

      setLoading(false);
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <p aria-busy="true">Loading artists...</p>;
  }

  return (
    <div>
      <h1>Artists</h1>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {artists.map(artist => (
          <ArtistCard key={artist.artist_id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
