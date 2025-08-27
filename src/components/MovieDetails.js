import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';

const API_KEY = '7764f155';
const BASE_URL = 'https://www.omdbapi.com';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get previous search state from navigation
  const previousSearchState = location.state;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        
        const data = await response.json();
        
        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found');
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

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : '/api/placeholder/300/450';

  const releaseYear = movie.Year || 'N/A';
  const runtime = movie.Runtime || 'N/A';
  const director = movie.Director || 'N/A';
  const cast = movie.Actors || 'N/A';
  const genre = movie.Genre || 'N/A';
  const plot = movie.Plot || 'No plot available';
  const rating = movie.imdbRating || 'N/A';

  const imdbUrl = movie.imdbID 
    ? `https://www.imdb.com/title/${movie.imdbID}` 
    : null;

  return (
    <div className="movie-detail-page">
      <div className="movie-main-info">
        <div>
          <img 
            src={posterUrl} 
            alt={movie.Title}
            className="movie-poster-large"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/450';
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
          
          <h1>{movie.Title}</h1>
          
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
            
            {movie.Country && (
              <div className="credit-item">
                <h4>Country</h4>
                <p>{movie.Country}</p>
              </div>
            )}
            
            {movie.Language && (
              <div className="credit-item">
                <h4>Language</h4>
                <p>{movie.Language}</p>
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