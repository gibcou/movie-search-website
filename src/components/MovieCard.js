import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const MovieCard = ({ movie, onClick }) => {
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : '/api/placeholder/280/400';
  
  const releaseYear = movie.Year || 'N/A';
  const isMovieFavorite = isFavorite(movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent movie click when clicking favorite button
    
    if (!user) {
      // Could redirect to login or show a message
      return;
    }
    
    if (isMovieFavorite) {
      removeFromFavorites(movie.imdbID);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="movie-card" onClick={onClick}>
      {user && (
        <button 
          className={`favorite-btn ${isMovieFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={isMovieFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <i className={`fas fa-heart ${isMovieFavorite ? 'filled' : ''}`}></i>
        </button>
      )}
      
      <img 
        src={posterUrl} 
        alt={movie.Title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = '/api/placeholder/280/400';
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{releaseYear}</p>
        <span className="movie-type">{movie.Type}</span>
      </div>
    </div>
  );
};

export default MovieCard;