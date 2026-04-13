import { Link } from "react-router";

import AddToPlaylist from "./AddToPlaylist";

type SongItem = {
  artist_id: null | number;
  artist_name: null | string;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function SongList({ songs }: { songs: SongItem[] }) {
  if (songs.length === 0) {
    return <p><em>No songs found.</em></p>;
  }

  return (
    <table className="striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Year</th>
          <th style={{ width: "1%" }} />
        </tr>
      </thead>
      <tbody>
        {songs.map(song => (
          <tr key={song.song_id}>
            <td>
              <Link to={`/songs/${song.song_id}`}>
                {song.title || "Untitled"}
              </Link>
            </td>
            <td>
              <Link to={`/artists/${song.artist_id}`}>
                {song.artist_name || "Unknown"}
              </Link>
            </td>
            <td>{song.year}</td>
            <td>
              <AddToPlaylist
                songId={song.song_id}
                songTitle={song.title || "Untitled"}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
