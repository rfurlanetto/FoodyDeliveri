import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuth();
  const hasAuth = Boolean(isAuthenticated || token || localStorage.getItem('token'));

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
