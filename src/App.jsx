import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import Spinner from './components/Spinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import MovieCard from './components/MovieCard.jsx';

function App() {
const [movies, setMovies] = useState([]);
const [favorites, setFavorites] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedMovie, setSelectedMovie] = useState(null);
const [view, setView] = useState('search'); // 'home', 'favorites', 'details'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB API limite à 500 pages
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, [searchTerm, page, view]);

const handleSearch = (term) => { 
  setSearchTerm(term);
  setPage(1); // Reset to first page on new search
};

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
          Favorites
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      
  </div>
   );
}

export default App;
