import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import EmployeesPage from "../pages/admin/EmployeesPage";
import ShiftsPage from "../pages/admin/ShiftsPage";
import DepartmentsPage from "../pages/admin/DepartmentsPage";
import DesignationsPage from "../pages/admin/DesignationsPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import EmployeeDashboardPage from "../pages/employee/EmployeeDashboardPage";
import EmployeeSystemLogPage from "../pages/employee/EmployeeSystemLogPage";
import EmployeeDetailsAnalyticsPage from "../pages/admin/EmployeeDetailsAnalyticsPage";

const RoutesList = () => {
  const { loading, user } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.is_admin ? "/admin/dashboard" : "/dashboard"} replace /> : <LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/systemlogs" element={<EmployeeSystemLogPage />} />

        {/* Admin-Only Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employee-details-analytics" element={<EmployeeDetailsAnalyticsPage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="designations" element={<DesignationsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesList;