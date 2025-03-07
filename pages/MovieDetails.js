import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // This hook helps to access params in URL

const API_KEY = "538799fedbe9eafde8a6eda9986f9f95"; // Your TMDb API Key

const MovieDetails = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetchMovieDetails(id); // Fetch movie details based on the ID
  }, [id]);

  const fetchMovieDetails = async (movieId) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovie(data); // Set movie details
    } catch (error) {
      setError(error.message); // Set error message if fetch fails
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading movie details...</div>; // Add a spinner or similar loading indicator
  }

  if (error) {
    return <p className="error-message">{error}</p>; // Display error message if fetch fails
  }

  if (!movie) {
    return <p>No movie found.</p>; // Handle the case where movie is not found
  }

  return (
    <div className="movie-details-container">
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      
      {/* Adding more details */}
      <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
      {movie.tagline && <p><strong>Tagline:</strong> {movie.tagline}</p>}

      {/* You can add more movie details here */}
    </div>
  );
};

export default MovieDetails;
