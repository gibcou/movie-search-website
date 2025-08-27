import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'demo_key';
const BASE_URL = 'https://api.themoviedb.org/3';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get previous search state from navigation
  const previousSearchState = location.state;

  const handleFavoriteClick = () => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
        );
        
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        
        const data = await response.json();
        
        if (!data.id) {
          throw new Error('Movie not found');
        }
        
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Movie details error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error || 'Movie not found'}</p>
          <Link to="/" className="back-btn">
            <i className="fas fa-arrow-left"></i>
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://picsum.photos/300/450?grayscale&blur=1';

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} minutes` : 'N/A';
  const director = movie.credits && movie.credits.crew 
    ? movie.credits.crew.find(person => person.job === 'Director')?.name || 'N/A'
    : 'N/A';
  const cast = movie.credits && movie.credits.cast 
    ? movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A'
    : 'N/A';
  const genre = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
  const plot = movie.overview || 'No plot available';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const imdbUrl = movie.imdb_id 
    ? `https://www.imdb.com/title/${movie.imdb_id}` 
    : `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <div className="movie-detail-page">
      <div className="movie-main-info">
        <div>
          <img 
            src={posterUrl} 
            alt={movie.title}
            className="movie-poster-large"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/300/450?grayscale&blur=1';
            }}
          />
        </div>
        
        <div className="movie-info-detailed">
          <Link 
            to="/" 
            className="back-to-search"
            state={previousSearchState}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Search
          </Link>
          
          <h1>{movie.title}</h1>
          
          <div className="movie-details-meta">
            <span>{releaseYear}</span>
            <span>{runtime}</span>
            {rating !== 'N/A' && (
              <span className="movie-rating">
                <i className="fas fa-star"></i>
                {rating}/10
              </span>
            )}
          </div>
          
          {genre !== 'N/A' && (
            <div className="movie-genres">
              {genre}
            </div>
          )}
          
          {plot !== 'No plot available' && (
            <div className="movie-overview">
              <h3>Plot</h3>
              <p>{plot}</p>
            </div>
          )}
          
          <div className="movie-credits">
            {director !== 'N/A' && (
              <div className="credit-item">
                <h4>Director</h4>
                <p>{director}</p>
              </div>
            )}
            
            {cast !== 'N/A' && (
              <div className="credit-item">
                <h4>Cast</h4>
                <p>{cast}</p>
              </div>
            )}
            
            {movie.production_countries && movie.production_countries.length > 0 && (
              <div className="credit-item">
                <h4>Country</h4>
                <p>{movie.production_countries.map(country => country.name).join(', ')}</p>
              </div>
            )}
            
            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
              <div className="credit-item">
                <h4>Language</h4>
                <p>{movie.spoken_languages.map(lang => lang.english_name).join(', ')}</p>
              </div>
            )}
          </div>
          
          <div className="movie-actions">
            {imdbUrl && (
              <a 
                href={imdbUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="imdb-btn"
              >
                <i className="fab fa-imdb"></i>
                View on IMDb
              </a>
            )}
            {user && (
              <button 
                className={`favorite-btn ${isFavorite(movie.id) ? 'favorited' : ''}`}
                onClick={handleFavoriteClick}
                title={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <i className={`fas fa-heart ${isFavorite(movie.id) ? 'favorited' : ''}`}></i>
                {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
            <button 
              onClick={() => navigate('/', { state: previousSearchState })} 
              className="back-btn"
            >
              <i className="fas fa-arrow-left"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;