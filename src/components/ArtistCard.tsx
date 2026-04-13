import { Link } from "react-router";

import type { Tables } from "../types/database";

interface ArtistCardProps {
  artist: Tables<"artists">;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article style={{ marginBottom: 0, textAlign: "center" }}>
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
  );
}
