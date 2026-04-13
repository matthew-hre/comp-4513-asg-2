import { useRef } from "react";
import { Link } from "react-router";

import { useAuth } from "../lib/auth";

export default function Header() {
  const { logout, user } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <strong>
              <Link to="/">
                Spotify II
              </Link>
            </strong>
          </li>
        </ul>
        <ul>
          <li><Link to="/songs">Songs</Link></li>
          <li><Link to="/artists">Artists</Link></li>
          <li><Link to="/genres">Genres</Link></li>
          {user && <li><Link to="/playlists">Playlists</Link></li>}
          <li><a href="#" onClick={(e) => { e.preventDefault(); dialogRef.current?.showModal(); }}>About</a></li>
          {user ? (
            <li><button onClick={logout}>Logout</button></li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      <dialog ref={dialogRef}>
        <article>
          <header>
            <button
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              rel="prev"
              type="button"
            />
            <h2>About</h2>
          </header>
          <p>
            <strong>COMP 4513 Assignment 2</strong>: A Spotify-like song browsing
            single-page application.
          </p>
          <p>
            <strong>Developer:</strong> <a href="https://matthew-hre.com" rel="noopener noreferrer" target="_blank">Matthew Hrehirchuk</a>
          </p>
          <p>
            <strong>Technologies:</strong> React, Vite, Supabase, PicoCSS, Recharts,
            React Router
          </p>
          <p>
            <a
              href="https://github.com/matthew-hre/comp-4513-asg-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              Source
            </a>
          </p>
        </article>
      </dialog>
    </header>
  );
}
