import { Link } from "react-router";

import "./Home.scss";

export default function Home() {
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

      <section id="features">
        <article>
          <h3>Browse</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum.
          </p>
        </article>
        <article>
          <h3>Discover</h3>
          <p>
            Cras ultricies ligula sed magna dictum porta. Proin eget tortor
            risus. Nulla quis lorem ut libero malesuada feugiat.
          </p>
        </article>
        <article>
          <h3>Playlist</h3>
          <p>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae. Donec velit neque, auctor sit amet.
          </p>
        </article>
      </section>
    </>
  );
}
