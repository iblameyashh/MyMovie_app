import { useState, useEffect } from "react";
import Searchin from "../Components/Searchin.jsx";
import Spinner from "../Components/spinner.jsx";
import MovieCard from "../Components/MovieCard.jsx";
import TrendingMovies from "../Components/TrendingMovies.jsx";
import { useDebounce } from "react-use";
import { API_BASE_URL, API_OPTION } from "../api/tmdb.js";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieslist, setMovieslists] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [DebouncesdQuery, setDebouncesdQuery] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingErrorMessage, setTrendingErrorMessage] = useState("");

  useDebounce(() => setDebouncesdQuery(query), 1000, [query]);
  // use Debounced use kiya hai kyuki jo ye search me input me type krega to har ek letter ke saath API call na ho


  const fetchMovies = async (TermQuery = '') => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const endPoint = TermQuery
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTION);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log(data);

      if (!data.results) {
        setErrorMessage("Failed to fetch Data");
        setMovieslists([]);
        return;
      }

      setMovieslists(data.results || []);

    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    setTrendingErrorMessage("");
    setIsTrendingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/trending/movie/week`, API_OPTION);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!data.results) {
        setTrendingErrorMessage("Failed to fetch trending movies");
        setTrendingMovies([]);
        return;
      }

      setTrendingMovies(data.results.slice(0, 10));

    } catch (error) {
      console.log(error);
      setTrendingErrorMessage("Something went wrong while loading trending movies");
    } finally {
      setIsTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(DebouncesdQuery);
  }, [DebouncesdQuery]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <>
      <div className="pattern" />

      <header className="p-0 m-0">
        <div className="wrapper">
          <img src="./hero-img.png" alt="Heroimg" />

          <h1>
            Find <span className="text-gradient">Movies&nbsp;</span>
            You'll Love Without the Hassle
          </h1>
        </div>

        <Searchin
          Searchin={query}
          setSearchin={setQuery}
        />
      </header>

      <TrendingMovies
        movies={trendingMovies}
        isLoading={isTrendingLoading}
        errorMessage={trendingErrorMessage}
      />

      <section className="all-movies">
        <h2 className="mt-10 text-center text-white">All Movies</h2>

        {isloading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-white">{errorMessage}</p>
        ) : (
          <ul className="text-white">
            {movieslist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default HomePage;
