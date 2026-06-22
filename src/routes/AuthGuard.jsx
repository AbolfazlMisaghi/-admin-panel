import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

const AuthGuard = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AuthGuard;