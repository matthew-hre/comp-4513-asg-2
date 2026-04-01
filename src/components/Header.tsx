import { Link } from "react-router";

import { useAuth } from "../lib/auth";

export default function Header() {
  const { logout, user } = useAuth();

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
          {user ? (
            <>
              <li><Link to="/browse">Browse</Link></li>
              <li><Link to="/artists">Artists</Link></li>
              <li><Link to="/genres">Genres</Link></li>
              <li><Link to="/playlists">Playlists</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
