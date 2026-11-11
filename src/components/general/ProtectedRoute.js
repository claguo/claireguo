// components/auth/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const password = Cookies.get("password");

  if (password !== "amphibian") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
