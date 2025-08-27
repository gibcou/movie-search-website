import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const MovieCard = ({ movie, onClick }) => {
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://picsum.photos/280/400?grayscale&blur=1';
  
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent movie click when clicking favorite button
    
    if (!user) {
      // Could redirect to login or show a message
      return;
    }
    
    if (isMovieFavorite) {
      removeFromFavorites(movie.id);
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
        alt={movie.title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = 'https://picsum.photos/280/400?grayscale&blur=1';
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>
        <span className="movie-type">{movie.Type}</span>
      </div>
    </div>
  );
};

export default MovieCard;