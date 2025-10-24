import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { userInfo } = useSelector((state) => state.user);

  if (!token && !role) {
    return <Navigate to="/sign-in" replace />;
  }
  console.log(userInfo.role);
  if (!allowedRoles.includes(userInfo?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
