import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }


      try {
        if (user) {
          console.log(user);
          setLoading(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthToken(token);
        setUser(response.data);
        if (response.data.is_admin && !location.pathname.startsWith("/admin")) {
          navigate("/admin/dashboard", { replace: true });
        } else if (!response.data.is_admin && !location.pathname.startsWith("/dashboard")) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Auth validation failed:", error);
        logout(false);
        navigate("/login", { replace: true });
      }
      setLoading(false);
    };

    fetchUser();
  }, [location.pathname]); // Runs when route changes

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login/`, { email, password });
      const { access_token } = response.data;
      setAuthToken(access_token);
      localStorage.setItem('token', access_token);

      const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userData = userRes.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate(userData.is_admin ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = (redirectToLogin = true) => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
    if (redirectToLogin) navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};