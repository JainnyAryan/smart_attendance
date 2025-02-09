import React from 'react';
import { useAuth } from '../context/AuthContext'; // Access authentication context
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Log out the user
    navigate('/');  // Redirect to Login page after logging out
  };

  return (
    <div>
      <h2>Welcome to the Dashboard, {user?.username}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;