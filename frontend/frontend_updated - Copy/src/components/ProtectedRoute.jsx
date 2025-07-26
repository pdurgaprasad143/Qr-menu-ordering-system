import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user was previously authenticated
  const wasAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    // Update localStorage when authentication state changes
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [isAuthenticated]);

  // If authenticated or was previously authenticated, render the protected content
  if (isAuthenticated || wasAuthenticated) {
    return children;
  }

  // If not authenticated, redirect to chef login
  return <Navigate to="/chef-login" replace />;
};

export default ProtectedRoute;
