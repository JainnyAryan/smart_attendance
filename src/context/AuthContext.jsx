import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function to update user state
  const login = (userData) => {
    setUser(userData);  // Set user data
    localStorage.setItem('user', JSON.stringify(userData));  // Store user data in localStorage
  };

  // Logout function to clear user state
  const logout = () => {
    setUser(null);  // Clear user data
    localStorage.removeItem('user');  // Remove from localStorage
    localStorage.removeItem('token');  // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};