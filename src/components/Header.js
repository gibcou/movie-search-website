import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onSearch, showResults }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page if not already there
      if (location.pathname !== '/') {
        navigate('/');
      }
      // Call the search function passed from parent
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const handleHomeClick = () => {
    // Clear search when going home
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-brand" onClick={handleHomeClick}>
          <i className="fas fa-film"></i>
          MovieSearch
        </Link>
        
        {/* Header Search - show on non-home pages or when there are search results */}
        {(location.pathname !== '/' || showResults) && (
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
        )}
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={handleHomeClick}
          >
            <i className="fas fa-home"></i>
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/favorites" 
                className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
              >
                <i className="fas fa-heart"></i>
                Favorites
              </Link>
              
              <div className="user-menu">
                <button 
                  className="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <i className="fas fa-user"></i>
                  {user.name}
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link 
                      to="/favorites" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-heart"></i>
                      My Favorites
                    </Link>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link nav-link-primary ${location.pathname === '/register' ? 'active' : ''}`}
              >
                <i className="fas fa-user-plus"></i>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;