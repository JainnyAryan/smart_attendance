import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconNumber4Small } from "@tabler/icons-react";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const { user, loading, loggedOut } = useAuth();

  if (loading) return null;
  if (!user) {
    if (!loggedOut) toast.error("Session timed-out. Please login again.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;