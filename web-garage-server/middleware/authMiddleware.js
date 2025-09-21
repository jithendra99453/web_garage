// web-garage-server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// A function to act as our middleware
const authMiddleware = (req, res, next) => {
  // 1. Get token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if a token exists
  if (!token) {
    // If no token, send a 401 Unauthorized response
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. If there is a token, verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // This is the log we added for debugging.
    // If it runs, we know the token is valid.
    console.log('DECODED TOKEN IN MIDDLEWARE:', decoded);

    // 4. Attach the decoded user payload to the request object
    req.user = decoded.user;
    
    // 5. Call next() to pass control to the next middleware function (or the route handler)
    next();
  } catch (err) {
    // If verification fails (invalid token), send a 401 response
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
