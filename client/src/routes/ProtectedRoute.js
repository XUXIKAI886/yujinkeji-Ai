import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminRequired }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && user?.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default ProtectedRoute; 