import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const UserContext = createContext(null);

// 2. Create the Provider component
export const UserProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 3. Define a reusable function to fetch data
  const fetchStudentData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      navigate('/login');
      return;
    }
    
    axios.defaults.headers.common['x-auth-token'] = token;
    try {
      const res = await axios.get('http://localhost:5000/api/profile');
      const completeData = {
        totalPoints: 0, // Ensure defaults
        ...res.data
      };
      setStudentData(completeData);
    } catch (err) {
      console.error('Failed to fetch user data', err);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // 4. Fetch data when the provider first mounts
  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // 5. Provide the data and the refresh function to all children
  const value = {
    studentData,
    isLoading,
    refreshStudentData: fetchStudentData // Expose the function
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
