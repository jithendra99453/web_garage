import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true on initial load
  const navigate = useNavigate();

  const fetchStudentData = useCallback(async () => {
    // Only set loading to true when we actually start the fetch
    setIsLoading(true);
    const token = localStorage.getItem('token');

    // If there's no token, we know the user is not logged in.
    // Stop loading and ensure data is null.
    if (!token) {
      setStudentData(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/profile');
      setStudentData(res.data);
    } catch (err) {
      // If the token is invalid, the API interceptor will handle the logout.
      // For any other error, just clear the data.
      setStudentData(null);
      console.error('Failed to fetch user data:', err);
    } finally {
      // This will run regardless of success or failure
      setIsLoading(false);
    }
  }, []); // Removed navigate from dependencies

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const value = {
    studentData,
    isLoading,
    refreshStudentData: fetchStudentData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
