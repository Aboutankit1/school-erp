import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const roleHome = {
  superadmin: "/superadmin",
  schooladmin: "/dashboard",
  teacher: "/dashboard",
  student: "/portal",
  parent: "/portal",
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
