import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconNumber4Small } from "@tabler/icons-react";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;