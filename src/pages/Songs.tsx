import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import supabase from "../lib/supabase";

type FilterState = {
  artists: string[];
  genres: string[];
  title: string;
  years: string[];
};

type PlaylistOption = {
  name: string;
  playlist_id: number;
};

type Song = {
  artist_id: null | number;
  genre_id: null | number;
  song_id: number;
  title: null | string;
  year: null | number;
};

export default function Songs() {
  const [filters, setFilters] = useState<FilterState>({
    artists: [],
    genres: [],
    title: "",
    years: [],
  });
  const [titleInput, setTitleInput] = useState("");
  const [sort, setSort] = useState("title");

  const [years, setYears] = useState<string[]>([]);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const [playlists, setPlaylists] = useState<PlaylistOption[]>([]);
  const [addingSongId, setAddingSongId] = useState<null | number>(null);
  const [toast, setToast] = useState<null | string>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: yearsData, error: yearsError } = await supabase
          .from("songs")
          .select("year")
          .order("year");
        if (yearsError) {
          // eslint-disable-next-line no-console
          console.error("Years error:", yearsError);
        }
        const uniqueYears = Array.from(
          new Set(yearsData?.map(s => s.year?.toString()).filter(Boolean) || [])
        ).sort();

        setYears(uniqueYears as string[]);

        const { data: artistsData, error: artistsError } = await supabase
          .from("artists")
          .select("*");
        if (artistsError) {
          // eslint-disable-next-line no-console
          console.error("Artists error:", artistsError);
        }
        // eslint-disable-next-line no-console
        console.log("Raw artists data:", artistsData);
        setArtists(
          artistsData?.map(a => ({ id: a.artist_id.toString(), name: a.artist_name || "" })) || []
        );

        const { data: genresData, error: genresError } = await supabase
          .from("genres")
          .select("*");
        if (genresError) {
          // eslint-disable-next-line no-console
          console.error("Genres error:", genresError);
        }
        // eslint-disable-next-line no-console
        console.log("Raw genres data:", genresData);
        setGenres(
          genresData?.map(g => ({ id: g.genre_id.toString(), name: g.genre_name || "" })) || []
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching filter options:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("songs")
          .select("song_id, title, year, artist_id, genre_id");

        if (filters.title) {
          query = query.ilike("title", `%${filters.title}%`);
        }
        if (filters.years.length > 0) {
          query = query.in("year", filters.years.map(y => parseInt(y)));
        }
        if (filters.artists.length > 0) {
          query = query.in("artist_id", filters.artists.map(a => parseInt(a)));
        }
        if (filters.genres.length > 0) {
          query = query.in("genre_id", filters.genres.map(g => parseInt(g)));
        }

        const sortMap = { artist: "artist_id", title: "title", year: "year" };
        query = query.order(sortMap[sort as keyof typeof sortMap] || "title");

        const { data, error } = await query;
        if (error) throw error;
        setSongs((data || []) as Song[]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [filters, sort]);

  const handleTitleSubmit = () => {
    setFilters(prev => ({ ...prev, title: titleInput }));
  };

  const handleClearTitle = () => {
    setTitleInput("");
    setFilters(prev => ({ ...prev, title: "" }));
  };

  const toggleYear = (year: string) => {
    setFilters(prev => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter(y => y !== year)
        : [...prev.years, year],
    }));
  };

  const toggleArtist = (artistId: string) => {
    setFilters(prev => ({
      ...prev,
      artists: prev.artists.includes(artistId)
        ? prev.artists.filter(a => a !== artistId)
        : [...prev.artists, artistId],
    }));
  };

  const toggleGenre = (genreId: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(g => g !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const clearAllFilters = () => {
    setFilters({ artists: [], genres: [], title: "", years: [] });
    setSort("title");
  };

  const getActiveFilterPills = () => {
    const pills = [];
    if (filters.title) pills.push({ label: filters.title, type: "title" });
    filters.years.forEach(year => pills.push({ label: year, type: "year" }));
    filters.artists.forEach(artistId => {
      const artist = artists.find(a => a.id === artistId);
      if (artist) pills.push({ label: artist.name, type: "artist" });
    });
    filters.genres.forEach(genreId => {
      const genre = genres.find(g => g.id === genreId);
      if (genre) pills.push({ label: genre.name, type: "genre" });
    });
    return pills;
  };

  const removePill = (label: string, type: string) => {
    if (type === "title") {
      handleClearTitle();
    } else if (type === "year") {
      toggleYear(label);
    } else if (type === "artist") {
      toggleArtist(
        artists.find(a => a.name === label)?.id || ""
      );
    } else if (type === "genre") {
      toggleGenre(
        genres.find(g => g.name === label)?.id || ""
      );
    }
  };

  const activePills = getActiveFilterPills();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlist_names")
        .select("playlist_id, name");
      setPlaylists((data || []) as PlaylistOption[]);
    };

    fetchPlaylists();
  }, []);

  const openAddModal = (songId: number) => {
    setAddingSongId(songId);
    dialogRef.current?.showModal();
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    if (addingSongId == null) return;

    const songTitle = songs.find(s => s.song_id === addingSongId)?.title || "Untitled";
    const playlistName = playlists.find(p => p.playlist_id === playlistId)?.name || "playlist";

    const { error } = await supabase
      .from("playlists")
      .insert({ playlist_id: playlistId, song_id: addingSongId });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error adding to playlist:", error);
      return;
    }

    dialogRef.current?.close();
    setAddingSongId(null);
    setToast(`Added "${songTitle}" to ${playlistName}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <h1>Songs</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTitleSubmit();
        }}
        role="search"
      >
        <input
          className="container-fluid"
          id="title-search"
          onChange={e => setTitleInput(e.target.value)}
          placeholder="Search..."
          type="search"
          value={titleInput}
        />

        <input
          aria-label="Submit title search"
          type="submit"
          value="Search"
        />
      </form>

      {filters.title && (
        <button
          aria-label="Clear title filter"
          onClick={handleClearTitle}
          style={{ marginBottom: "1rem" }}
          type="button"
        >
          Clear title: "{filters.title}"
        </button>
      )}

      <div style={{ display: "flex", gap: "1rem" }}>
        <label htmlFor="years-select" style={{ flex: "1" }}>
          <strong>Years</strong>

          <select
            disabled={filters.years.length === years.length}
            id="years-select"
            onChange={(e) => {
              if (e.target.value) {
                toggleYear(e.target.value);
                e.target.value = "";
              }
            }}
            value=""
          >
            <option value="">
              {filters.years.length === years.length ? "All years enabled" : "Select year..."}
            </option>
            {years
              .filter(year => !filters.years.includes(year))
              .map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </label>
        <label htmlFor="artists-select" style={{ flex: "1" }}>
          <strong>Artists</strong>

          <select
            disabled={filters.artists.length === artists.length}
            id="artists-select"
            onChange={(e) => {
              if (e.target.value) {
                toggleArtist(e.target.value);
                e.target.value = "";
              }
            }}
            value=""
          >
            <option value="">Select artist...</option>
            {artists
              .filter(artist => !filters.artists.includes(artist.id))
              .map(artist => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
          </select>
        </label>
        <label htmlFor="genres-select" style={{ flex: "1" }}>
          <strong>Genres</strong>

          <select
            id="genres-select"
            onChange={(e) => {
              if (e.target.value) {
                toggleGenre(e.target.value);
                e.target.value = "";
              }
            }}
            value=""
          >
            <option value="">Select genre...</option>
            {genres
              .filter(genre => !filters.genres.includes(genre.id))
              .map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
          </select>
        </label>
      </div>


      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <label htmlFor="sort-select" style={{ marginRight: "0.5rem" }}>
          <strong>Sort</strong>

          <select
            id="sort-select"
            onChange={e => setSort(e.target.value)}
            value={sort}
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="artist">Artist</option>
          </select>
        </label>
        <div>
          {activePills.length > 0 && (
            <>
              {" "}
              <label htmlFor="clear-all"><strong>Clear All</strong>
                <button onClick={clearAllFilters} type="submit">
                  Clear
                </button>
              </label>
            </>
          )}
        </div>
      </div>

      {activePills.length > 0 && (
        <div style={{display: "flex", gap: "0.5rem"}}>
          {activePills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => removePill(pill.label, pill.type)}
              style={{
                borderRadius: "1rem",
                padding: "0.25rem 0.75rem",
              }}
              type="button"
            >
              {pill.label}
              {" "}
              ✕
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
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
            {songs.map(song => {
              const artistName = artists.find(
                a => parseInt(a.id) === song.artist_id
              )?.name || "Unknown";
              return (
                <tr key={song.song_id}>
                  <td>
                    <Link to={`/song/${song.song_id}`}>
                      {song.title || "Untitled"}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/artist/${song.artist_id}`}>
                      {artistName}
                    </Link>
                  </td>
                  <td>{song.year}</td>
                  <td>
                    <button
                      className="outline"
                      onClick={() => openAddModal(song.song_id)}
                      style={{ margin: 0, padding: "0.25rem 0.75rem" }}
                      type="button"
                    >
                      +
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <dialog ref={dialogRef}>
        <article>
          <header>
            <button
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              rel="prev"
              type="button"
            />
            <h2>Add to Playlist</h2>
          </header>
          {playlists.length === 0 ? (
            <p><em>No playlists yet. Create one on the Playlists page.</em></p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {playlists.map(p => (
                <li key={p.playlist_id} style={{ marginBottom: "0.5rem" }}>
                  <button
                    className="outline"
                    onClick={() => handleAddToPlaylist(p.playlist_id)}
                    style={{ width: "100%" }}
                    type="button"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </dialog>

      {toast && (
        <div
          role="alert"
          style={{
            background: "var(--pico-primary-background)",
            borderRadius: "var(--pico-border-radius)",
            bottom: "1rem",
            color: "var(--pico-primary-inverse)",
            padding: "0.75rem 1.5rem",
            position: "fixed",
            right: "1rem",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
