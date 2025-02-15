import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import PrivateRoute from './PrivateRoute';
import EmployeesPage from '../pages/admin/EmployeesPage';
import ShiftsPage from '../pages/admin/ShiftsPage';
import DepartmentsPage from '../pages/admin/DepartmentsPage';
import DesignationsPage from '../pages/admin/DesignationsPage';


const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route element={<PrivateRoute />}>
        <Route path='/admin'>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path='dashboard' element={<AdminDashboardPage />} />
          <Route path='employees' element={<EmployeesPage />} />
          <Route path='shifts' element={<ShiftsPage />} />
          <Route path='departments' element={<DepartmentsPage />} />
          <Route path='designations' element={<DesignationsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesList;