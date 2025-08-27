import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('movieAppUser');
    const savedFavorites = localStorage.getItem('movieAppFavorites');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    setLoading(false);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('movieAppUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('movieAppUser');
    }
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('movieAppFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = (email, password) => {
    // Simple mock authentication - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('movieAppUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userWithoutPassword);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    // Simple mock registration - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem('movieAppUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // In real app, this would be hashed
    };
    
    users.push(newUser);
    localStorage.setItem('movieAppUsers', JSON.stringify(users));
    
    // Auto-login after registration
    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userWithoutPassword);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
  };

  const addToFavorites = (movie) => {
    if (!user) return false;
    
    const isAlreadyFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    if (!isAlreadyFavorite) {
      setFavorites(prev => [...prev, movie]);
      return true;
    }
    return false;
  };

  const removeFromFavorites = (movieId) => {
    if (!user) return false;
    
    setFavorites(prev => prev.filter(fav => fav.imdbID !== movieId));
    return true;
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.imdbID === movieId);
  };

  const value = {
    user,
    favorites,
    loading,
    login,
    register,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};