import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { Tables } from "../types/database";

import supabase from "../lib/supabase";

export default function Genres() {
  const [genres, setGenres] = useState<Tables<"genres">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("*")
        .order("genre_name");

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching genres:", error);
      } else {
        setGenres(data || []);
      }

      setLoading(false);
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <p aria-busy="true">Loading genres...</p>;
  }

  return (
    <div>
      <h1>Genres</h1>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {genres.map(genre => (
          <article key={genre.genre_id} style={{ marginBottom: 0, textAlign: "center" }}>
            <Link
              style={{ color: "inherit", textDecoration: "none" }}
              to={`/genres/${genre.genre_id}`}
            >
              <div
                style={{
                  alignItems: "center",
                  aspectRatio: "1",
                  background: "var(--pico-secondary-background)",
                  borderRadius: "var(--pico-border-radius)",
                  display: "flex",
                  fontSize: "2rem",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {genre.genre_name ? genre.genre_name[0].toUpperCase() : "?"}
              </div>
              <strong style={{ display: "block", marginTop: "0.5rem" }}>
                {genre.genre_name || "Unknown Genre"}
              </strong>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
