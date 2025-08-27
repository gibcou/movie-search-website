import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

function Favorites() {
  const { user, favorites, removeFromFavorites } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="favorites-page">
        <div className="auth-required">
          <h2>Login Required</h2>
          <p>Please log in to view your favorite movies.</p>
          <Link to="/login" className="auth-btn">Login</Link>
        </div>
      </div>
    );
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFavorite = (movieId, e) => {
    e.stopPropagation(); // Prevent movie click when removing
    removeFromFavorites(movieId);
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Movies</h1>
        <p>Welcome back, {user.name}! Here are your saved movies.</p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <div className="no-favorites-content">
            <i className="fas fa-heart-broken"></i>
            <h3>No favorites yet</h3>
            <p>Start exploring movies and save your favorites!</p>
            <Link to="/" className="browse-btn">Browse Movies</Link>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie) => (
            <div key={movie.imdbID} className="favorite-movie-item">
              <MovieCard 
                movie={movie}
                onClick={() => handleMovieClick(movie.imdbID)}
              />
              <button 
                className="remove-favorite-btn"
                onClick={(e) => handleRemoveFavorite(movie.imdbID, e)}
                title="Remove from favorites"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {favorites.length > 0 && (
        <div className="favorites-stats">
          <p>You have {favorites.length} favorite movie{favorites.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}

export default Favorites;