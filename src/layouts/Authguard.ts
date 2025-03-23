import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }: any) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default AuthGuard;
