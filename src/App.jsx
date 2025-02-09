import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesList from './routes/routes'; // Import the routes from routes.js
import { AuthProvider } from './context/AuthContext'; // If using authentication context

const App = () => {
  return (
    <AuthProvider>  {/* Wrap the app in AuthProvider if using context for auth */}
      <Router>
        <RoutesList />  {/* Render the defined routes */}
      </Router>
    </AuthProvider>
  );
};

export default App;