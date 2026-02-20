import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Pagination from "./components/Pagination";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [view, setView] = useState("search"); // 'search' or 'favorites'

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, initialized]);

  useEffect(() => {
    if (view === "favorites") {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url;
        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchTerm
          )}&page=${page}`;
        } else {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        console.log(data);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages || 0, 500)); // TMDB API max page limit
      } catch (err) {
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm, page, view]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openModal = async (movieId) => {
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      );
      if (!res.ok) throw new Error("Failed to fetch movie details");
      const data = await res.json();
      setSelectedMovie(data);
    } catch (err) {
      setError("Failed to fetch movie details.");
    }
  };

  const closeModal = () => setSelectedMovie(null);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((f) => f.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== movie.id));
    } else {
      const favMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
      };
      setFavorites([...favorites, favMovie]);
    }
  };

  const isFavorite = (movieId) => favorites.some((f) => f.id === movieId);

  const displayedMovies = view === "search" ? movies : favorites;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl">
        Movie App
      </h1>
      <div className="tabs tabs-border mb-6">
        <a
          className={`tab text-lg ${view === "search" ? "tab-active" : ""}`}
          onClick={() => {
            setView("search");
            setPage(page);
          }}
        >
          Search / Popular
        </a>
        <a
          className={`tab text-lg ${view === "favorites" ? "tab-active" : ""}`}
          onClick={() => setView("favorites")}
        >
          Favorites ({favorites.length})
        </a>
      </div>

      {view === "search" && (
        <div className="w-full max-w-md mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && displayedMovies.length === 0 && (
        <div>
          No movies found.{" "}
          {view === "favorites"
            ? "Add some to your favorites!"
            : "Try a different search."}
        </div>
      )}
      {!loading && !error && displayedMovies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(movie.id)}
              onViewDetails={openModal}
            />
          ))}
        </div>
      )}

      {view === "search" && totalPages > 1 && !loading && !error && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={closeModal}
          isFavorite={isFavorite(selectedMovie.id)}
          onToggleFavorite={() => toggleFavorite(selectedMovie)}
        />
      )}
    </div>
  );
}

export default App;