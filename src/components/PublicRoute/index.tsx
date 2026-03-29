import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
