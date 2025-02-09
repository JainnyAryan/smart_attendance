import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';


const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />  {/* Public route: Login */}
      <Route path="/dashboard" element={<DashboardPage />} />  {/* Protected route: Dashboard */}
      <Route path="/admin" element={<AdminDashboardPage />} />  {/* Protected route: Dashboard */}
      <Route path="*" element={<NotFoundPage />} />  {/* Handle 404: Page Not Found */}
    </Routes>
  );
};

export default RoutesList;