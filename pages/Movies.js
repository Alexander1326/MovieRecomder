import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Movies.css";

const API_KEY = "538799fedbe9eafde8a6eda9986f9f95"; // Your TMDb API Key

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [flippedMovieId, setFlippedMovieId] = useState(null); // To track flipped movie

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchMovies(searchQuery);
    } else if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre);
    }
  }, [searchQuery, selectedGenre]);

  const fetchGenres = () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  };

  const fetchMovies = (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        alert("There was an error fetching the movies. Please try again later.");
      });
  };

  const fetchMoviesByGenre = (genreId) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies by genre:", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedGenre("");  // Clear genre filter if a search is performed
    fetchMovies(searchQuery);
  };

  const toggleGenreDropdown = () => {
    setShowGenres(!showGenres);
  };

  const handlePosterClick = (movieId) => {
    setFlippedMovieId(movieId === flippedMovieId ? null : movieId); // Toggle flip state
  };

  return (
    <div className="movies-container">
      <h2>Search Movies</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter movie name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        <div className="genre-dropdown">
          <button type="button" onClick={toggleGenreDropdown}>
            Filter by Genre
          </button>
          {showGenres && (
            <div className="genre-options">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="genre-option"
                  onClick={() => {
                    setSelectedGenre(genre.id);
                    setSearchQuery(""); // Clear search query when genre is selected
                    setShowGenres(false);
                  }}
                >
                  {genre.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className={`movie-card ${flippedMovieId === movie.id ? 'flipped' : ''}`}
              onClick={() => handlePosterClick(movie.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <h3>{movie.title}</h3>
              <div className="button-container">
                <Link to={`/movies/${movie.id}`} className="details-button">
                  View Details
                </Link>
                <button
                  className="watchlist-button"
                  onClick={() => addToWatchlist(movie)}
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

const addToWatchlist = (movie) => {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.some((m) => m.id === movie.id)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Movie added to Watchlist!");
  } else {
    alert("Already in Watchlist!");
  }
};

export default Movies;
