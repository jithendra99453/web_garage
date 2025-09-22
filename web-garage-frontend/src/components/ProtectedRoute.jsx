import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../context/UserContext';

const ProtectedRoute = () => {
  const { studentData, isLoading } = useContext(UserContext);

  // KEY FIX: Wait for the loading to finish
  if (isLoading) {
    // While loading, render nothing or a spinner
    return <div>Loading...</div>; 
  }

  // After loading, if there's user data, show the protected content
  if (studentData) {
    return <Outlet />;
  }

  // If loading is done and there is no user data, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
