import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login/`, { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const userData = userRes.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect based on admin status
      navigate(userData.is_admin ? '/admin' : '/dashboard', { replace: true });
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};