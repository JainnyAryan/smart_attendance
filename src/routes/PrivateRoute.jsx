import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Use AuthContext to check if user is authenticated

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth();  // Get user from AuthContext
  
  return (
    <Route 
      {...rest} 
      element={user ? element : <Navigate to="/" />}  // If authenticated, show the route, else redirect to login
    />
  );
};

export default PrivateRoute;