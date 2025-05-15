import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard if user doesn't have required role
    return <Navigate to={user.role === 'admin' ? '/admin/index' : '/user/home'} replace />;
  }

  return children;
};

export default ProtectedRoute; 