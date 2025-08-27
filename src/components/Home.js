import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MovieCard from './MovieCard';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'demo_key';
const BASE_URL = 'https://api.themoviedb.org/3';

const Home = forwardRef(({ externalSearchQuery, onShowResultsChange }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleExternalSearch: (query) => {
      if (query) {
        setSearchQuery(query);
        searchMovies(query, 1);
      } else {
        // Clear search when empty query
        setSearchQuery('');
        setMovies([]);
        setShowResults(false);
        setCurrentPage(1);
        setTotalPages(0);
      }
    }
  }));

  // Restore previous search state when navigating back from movie details
  useEffect(() => {
    if (location.state) {
      const {
        searchQuery: prevSearchQuery,
        movies: prevMovies,
        currentPage: prevCurrentPage,
        totalPages: prevTotalPages,
        sortBy: prevSortBy,
        yearFilter: prevYearFilter,
        showResults: prevShowResults
      } = location.state;
      
      setSearchQuery(prevSearchQuery || '');
      setMovies(prevMovies || []);
      setCurrentPage(prevCurrentPage || 1);
      setTotalPages(prevTotalPages || 0);
      setSortBy(prevSortBy || '');
      setYearFilter(prevYearFilter || '');
      setShowResults(prevShowResults || false);
      
      // Clear the state to prevent re-restoration on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle external search query changes
  useEffect(() => {
    if (externalSearchQuery && externalSearchQuery !== searchQuery) {
      setSearchQuery(externalSearchQuery);
      searchMovies(externalSearchQuery, 1);
    }
  }, [externalSearchQuery]);

  // Notify parent component when showResults changes
  useEffect(() => {
    if (onShowResultsChange) {
      onShowResultsChange(showResults);
    }
  }, [showResults, onShowResultsChange]);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setMovies([]);
        setTotalPages(0);
        setCurrentPage(1);
        setShowResults(true);
        return;
      }
      
      let filteredMovies = data.results || [];
      
      // Apply year filter
      if (yearFilter) {
        filteredMovies = filteredMovies.filter(movie => {
          const movieYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
          return movieYear === yearFilter;
        });
      }
      
      // Apply sorting
      if (sortBy) {
        filteredMovies = [...filteredMovies].sort((a, b) => {
          switch (sortBy) {
            case 'title-asc':
              return a.title.localeCompare(b.title);
            case 'title-desc':
              return b.title.localeCompare(a.title);
            case 'year-newest':
              const yearA = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
              const yearB = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
              return yearB - yearA;
            case 'year-oldest':
              const yearC = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
              const yearD = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
              return yearC - yearD;
            default:
              return 0;
          }
        });
      }
      
      setMovies(filteredMovies);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
      setShowResults(true);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMovies(searchQuery, 1);
    }
  };

  const handlePageChange = (page) => {
    searchMovies(searchQuery, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSortBy('');
    setYearFilter('');
    if (searchQuery) {
      searchMovies(searchQuery, 1);
    }
  };

  const handleMovieClick = (movieId) => {
    // Pass current search state to movie details page
    navigate(`/movie/${movieId}`, {
      state: {
        searchQuery,
        movies,
        currentPage,
        totalPages,
        sortBy,
        yearFilter,
        showResults: true
      }
    });
  };

  // Re-search when filters change
  useEffect(() => {
    if (searchQuery && showResults) {
      searchMovies(searchQuery, 1);
    }
  }, [sortBy, yearFilter]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div>
      {!showResults && (
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Discover Amazing Movies</h1>
            <p className="hero-subtitle">
              Search through thousands of movies and find your next favorite film
            </p>
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Filters - Only visible when there are search results */}
      {showResults && (
        <section className="filters-section">
          <div className="container">
            <div className="filters">
              <div className="filter-group">
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                  <option value="year-newest">Year (Newest)</option>
                  <option value="year-oldest">Year (Oldest)</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select
                  className="filter-select"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <button className="clear-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </section>
      )}

      {showResults && (
        <section className="search-section">
          <div className="container">

            {loading && (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Searching movies...</span>
              </div>
            )}

            {error && (
              <div className="error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && movies.length === 0 && showResults && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No movies found. Try a different search term.</p>
              </div>
            )}

            {!loading && movies.length > 0 && (
              <>
                <div className="search-results">
                  {movies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleMovieClick(movie.id)}
                    />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
});

export default Home;