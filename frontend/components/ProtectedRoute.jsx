import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredUserType, isAdminOnly }) => {
  const user = JSON.parse(localStorage.getItem('user'));  // Get user data from localStorage
  const authToken = localStorage.getItem('authToken');
  if(user){
    sessionStorage.setItem("userId", user.user_id);
    sessionStorage.setItem("userLocation", user.location);
    sessionStorage.setItem("user", JSON.stringify(user.username));
    }
  // If user is not authenticated, redirect to login
  if (!authToken || !user) {
    return <Navigate to="/login" />;
  }

  // If the route requires admin access, check user_type
  if (isAdminOnly && user.user_type !== 'admin') {
    return <Navigate to="/home" />;
  }

  // If user is authenticated and has the correct user type (if applicable), render the protected route
  return children;
};

export default ProtectedRoute;
