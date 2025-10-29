import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.user) || {};
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || userInfo?.role;

  // Not logged in
  if (!token || !role) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render protected routes
  return <Outlet />;
};

export default ProtectedRoute;
