import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { Tables } from "../types/database";

import supabase from "../lib/supabase";
import "./Home.scss";

export default function Home() {
  const [artists, setArtists] = useState<Tables<"artists">[]>([]);

  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      const { data, error } = await supabase.from("artists").select("*");

      if (!error && data && data.length >= 4) {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setArtists(shuffled.slice(0, 4));
      }
    };

    fetchFeaturedArtists();
  }, []);

  return (
    <>
      <section id="hero">
        <hgroup>
          <h1>Spotify II</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </hgroup>
        <div id="hero-cta">
          <Link role="button" to="/login">
            Get Started
          </Link>
        </div>
      </section>

      <section id="featured-artists">
        <h2>Featured Artists</h2>
        <div className="featured-grid">
          {artists.map(artist => (
            <article key={artist.artist_id}>
              <Link to={`/artists/${artist.artist_id}`}>
                {artist.artist_image_url ? (
                  <img
                    alt={artist.artist_name || "Artist"}
                    src={artist.artist_image_url}
                  />
                ) : (
                  <div className="no-image">
                    <span>No image</span>
                  </div>
                )}
                <strong>{artist.artist_name || "Unknown Artist"}</strong>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
