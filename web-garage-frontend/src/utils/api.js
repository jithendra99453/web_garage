import axios from 'axios';

// 1. Create a centralized Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add a request interceptor to automatically attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.error('Unauthorized! Logging out.');
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(err);
  }
);

/**
 * Sends a request to the backend to award points to the logged-in user.
 * @param {number} points - The number of points to award.
 * @returns {Promise<object|undefined>} A promise that resolves with the server's response.
 */
export async function awardPoints(points) {
  try {
    const response = await api.patch('/profile/points', { points }); 
    
    // --- THE FIX IS HERE ---
    // Change 'response.data.totalPoints' to 'response.data.newTotalPoints'
    console.log(`Successfully awarded ${points} points. New total:`, response.data.newTotalPoints);
    
    return response.data;
  } catch (error) {
    console.error('Failed to award points:', error.response?.data?.msg || error.message);
  }
}

export default api;
