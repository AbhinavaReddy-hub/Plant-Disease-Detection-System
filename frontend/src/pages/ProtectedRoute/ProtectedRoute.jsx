import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Optional: show a loading spinner while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
