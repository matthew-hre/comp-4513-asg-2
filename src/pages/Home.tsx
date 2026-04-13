import { useEffect, useState } from "react";
import { Link } from "react-router";

import type { Tables } from "../types/database";

import ArtistCard from "../components/ArtistCard";
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
            <ArtistCard artist={artist} key={artist.artist_id} />
          ))}
        </div>
      </section>
    </>
  );
}
