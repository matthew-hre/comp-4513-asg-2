import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { Tables } from "../types/database";

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
          <article key={artist.artist_id} style={{ marginBottom: 0, textAlign: "center" }}>
            <Link
              style={{ color: "inherit", textDecoration: "none" }}
              to={`/artists/${artist.artist_id}`}
            >
              {artist.artist_image_url ? (
                <img
                  alt={artist.artist_name || "Artist"}
                  src={artist.artist_image_url}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "var(--pico-border-radius)",
                    objectFit: "cover",
                    width: "100%",
                  }}
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
                  <span>No image</span>
                </div>
              )}
              <strong style={{ display: "block", marginTop: "0.5rem" }}>
                {artist.artist_name || "Unknown Artist"}
              </strong>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
