import axios from 'axios';

/**
 * Sends a request to the backend to award points to the logged-in user.
 * @param {number} points - The number of points to award.
 * @returns {Promise<object|undefined>} A promise that resolves with the server's response (e.g., { totalPoints: ... }) or undefined on error.
 */
export async function awardPoints(points) {
  // 1. Get the authentication token from local storage
  const token = localStorage.getItem('token');
  
  // 2. If there's no token, we can't proceed.
  if (!token) {
    console.warn('User is not authenticated. Points cannot be awarded.');
    return; // Exit the function
  }

  // 3. Use a try...catch block to handle potential network errors
  try {
    // 4. Send a PATCH request to the backend endpoint
    const response = await axios.patch(
      'http://localhost:5000/api/profile/points',
      { points }, // The data payload: { "points": ... }
      {
        headers: {
          'x-auth-token': token // Include the auth token in the headers
        }
      }
    );
    
    // 5. Log the success and return the updated data
    console.log(`Successfully awarded ${points} points. New total:`, response.data.totalPoints);
    return response.data;

  } catch (error) {
    // 6. If an error occurs, log it for debugging
    console.error('Failed to award points:', error.response?.data?.msg || error.message);
  }
}
