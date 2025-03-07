import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popularMovies, setPopularMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=538799fedbe9eafde8a6eda9986f9f95&language=en-US&page=1"
        );
        const moviesByGenre = response.data.results.reduce((acc, movie) => {
          movie.genre_ids.forEach((genreId) => {
            if (!acc[genreId]) {
              acc[genreId] = [];
            }
            acc[genreId].push(movie);
          });
          return acc;
        }, {});
        setPopularMovies(moviesByGenre);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      console.log(response.data); // Log the response for debugging

      // Redirect to Dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.response ? error.response.data.message : "An error occurred");
    }
  };

  const renderMovieSection = (genre, movies) => {
    if (!movies || movies.length === 0) {
      return (
        <div className="movie-section" key={genre}>
          <h3>{genre}</h3>
          <div className="work-in-progress">Work in Progress</div>
        </div>
      );
    }

    return (
      <div className="movie-section" key={genre}>
        <h3>{genre}</h3>
        <div className="movies-row">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to MovieVerse</h1>
        <p>Share, Review & Discover Movies!</p>

        {/* Login and Signup Forms */}
        <div className="form-container">
          <div className="form-box">
            <h2>Sign Up</h2>
            <form>
              <input type="text" placeholder="Username" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit">Sign Up</button>
            </form>
          </div>

          <div className="form-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
            {loginError && <p className="error-message">{loginError}</p>}
          </div>
        </div>
      </div>

      {/* Popular Movies Section */}
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        Object.keys(popularMovies).map((genreId) => {
          const genre = genreMapping[genreId] || "Unknown Genre";
          return renderMovieSection(genre, popularMovies[genreId]);
        })
      )}
    </div>
  );
};

// Genre mapping object
const genreMapping = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default Home;
