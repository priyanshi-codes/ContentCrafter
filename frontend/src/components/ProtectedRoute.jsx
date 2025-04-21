import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route that requires authentication
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

// Route that requires user to be unauthenticated (like login page)
export const PublicRoute = ({ children, redirectTo = '/user-dashboard' }) => { // Changed default redirectTo to user-dashboard
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  return !isAuthenticated ? children : <Navigate to={redirectTo} />;
};

// Conditional route for homepage that:
// - Shows the regular dashboard for first-time/unauthenticated users
// - Shows user dashboard for authenticated users
export const ConditionalHomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  return isAuthenticated ? <Navigate to="/user-dashboard" /> : <Navigate to="/dashboard" />;
};
