import { Link } from "react-router";

export default function Header() {
  return (
    <header className="
      flex items-center justify-between border-b border-white/10 px-6 py-4
    ">
      <Link className="text-xl font-bold" to="/">
        Spotify II
      </Link>
      <nav className="flex gap-4">
        <Link to="/browse">Browse</Link>
        <Link to="/artists">Artists</Link>
        <Link to="/genres">Genres</Link>
        <Link to="/playlists">Playlists</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
