
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // ===============================
  // Check authentication
  // ===============================

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ===============================
  // User is authenticated
  // ===============================

  return <Outlet />;
}

export default ProtectedRoute;