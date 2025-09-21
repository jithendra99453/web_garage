import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if a JWT exists in local storage
  const token = localStorage.getItem('token');
  
  // If a token exists, allow access to the nested route (the dashboard)
  // Otherwise, redirect the user to the login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
