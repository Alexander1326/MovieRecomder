import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Popolarmovie.css"; // Import the CSS file

const API_KEY = "538799fedbe9eafde8a6eda9986f9f95"; // Your API Key

const PopularMovies = () => {
  const [popularMovies, setPopularMovies] = useState({
    2024: { genre: {}, language: {} },
    2025: { genre: {}, language: {} },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&year=2024`
      );
      const data2024 = response.data.results;

      const response2025 = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&year=2025`
      );
      const data2025 = response2025.data.results;

      categorizeMovies(data2024, 2024);
      categorizeMovies(data2025, 2025);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    }
  };

  const categorizeMovies = (movies, year) => {
    const genreCategories = {};
    const languageCategories = {};

    movies.forEach((movie) => {
      movie.genre_ids.forEach((genreId) => {
        if (!genreCategories[genreId]) {
          genreCategories[genreId] = [];
        }
        genreCategories[genreId].push(movie);
      });

      if (!languageCategories[movie.original_language]) {
        languageCategories[movie.original_language] = [];
      }
      languageCategories[movie.original_language].push(movie);
    });

    setPopularMovies((prev) => ({
      ...prev,
      [year]: {
        genre: genreCategories,
        language: languageCategories,
      },
    }));
  };

  const renderMovieCards = (movies) => {
    return movies.map((movie) => (
      <div key={movie.id} className="movie-item"> {/* Changed class name to match CSS */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <h3>{movie.title}</h3>
        <p>{movie.release_date}</p>
      </div>
    ));
  };

  return (
    <div className="popular-movies-container"> {/* Changed class name to match CSS */}
      {loading ? (
        <p>Loading popular movies...</p>
      ) : (
        <>
          <h2>Popular Movies - 2024</h2>
          <div className="movie-list">
            {Object.keys(popularMovies[2024].genre).map((genreId) => (
              <div className="category" key={genreId}>
                <h3>Genre {genreId}</h3>
                <div className="movies-row">
                  {renderMovieCards(popularMovies[2024].genre[genreId])}
                </div>
              </div>
            ))}
            {Object.keys(popularMovies[2024].language).map((language) => (
              <div className="category" key={language}>
                <h3>Language: {language}</h3>
                <div className="movies-row">
                  {renderMovieCards(popularMovies[2024].language[language])}
                </div>
              </div>
            ))}
          </div>

          <h2>Popular Movies - 2025</h2>
          <div className="movie-list">
            {Object.keys(popularMovies[2025].genre).map((genreId) => (
              <div className="category" key={genreId}>
                <h3>Genre {genreId}</h3>
                <div className="movies-row">
                  {renderMovieCards(popularMovies[2025].genre[genreId])}
                </div>
              </div>
            ))}
            {Object.keys(popularMovies[2025].language).map((language) => (
              <div className="category" key={language}>
                <h3>Language: {language}</h3>
                <div className="movies-row">
                  {renderMovieCards(popularMovies[2025].language[language])}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularMovies;
