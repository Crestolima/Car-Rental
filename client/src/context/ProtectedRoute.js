// context/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, role }) => {
  // Use context to access authentication status and user role
  const { isAuthenticated, userRole } = useContext(AuthContext);

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the role does not match, redirect to login page (or a 'Forbidden' page)
  if (role && role !== userRole) {
    return <Navigate to="/login" replace />;
  }

  // If everything is good, render the children components
  return children;
};

export default ProtectedRoute;