import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesList from './routes/routes'; // Import the routes from routes.js
import { AuthProvider, useAuth } from './context/AuthContext'; // If using authentication context
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      <AuthProvider>  {/* Wrap the app in AuthProvider if using context for auth */}
        <ToastContainer position="bottom-center" autoClose={3000} />
        <RoutesList />  {/* Render the defined routes */}
      </AuthProvider>
    </Router>
  );
};

export default App;