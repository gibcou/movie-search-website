import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const homeRef = useRef();

  const handleHeaderSearch = (query) => {
    setHeaderSearchQuery(query);
    // Trigger search in Home component if it exists
    if (homeRef.current && homeRef.current.handleExternalSearch) {
      homeRef.current.handleExternalSearch(query);
    }
  };

  const handleShowResultsChange = (hasResults) => {
    setShowResults(hasResults);
  };

  return (
    <AuthProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Header onSearch={handleHeaderSearch} showResults={showResults} />
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  ref={homeRef}
                  externalSearchQuery={headerSearchQuery}
                  onShowResultsChange={handleShowResultsChange}
                />
              } 
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
