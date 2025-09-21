const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the 'Authorization' header
  const authHeader = req.header('Authorization');

  // 2. Check if the token exists and is in the correct format ('Bearer <token>')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Extract the token from the header
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using your JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded user payload to the request object
    // This makes req.user available in your protected routes
    req.user = decoded.user;
    
    // 6. Pass control to the next middleware or the route handler
    next();
  } catch (err) {
    // 7. If the token is invalid (expired, malformed, etc.), send a 401 response
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
