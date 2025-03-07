import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Watchlist.css";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(savedMovies);
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedList = watchlist.filter((movie) => movie.imdbID !== id);
    localStorage.setItem("watchlist", JSON.stringify(updatedList));
    setWatchlist(updatedList);
  };

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      {watchlist.length > 0 ? (
        <div className="movies-grid">
          {watchlist.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <Link to={`/movies/${movie.imdbID}`} className="details-button">
                View Details
              </Link>
              <button
                className="remove-button"
                onClick={() => removeFromWatchlist(movie.imdbID)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies in Watchlist.</p>
      )}
    </div>
  );
};

export default Watchlist;
