// web-garage-server/routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware'); // Protect the route

// Defines the route: POST /api/chat/
// The 'auth' middleware ensures only logged-in users can use the chatbot.
router.post('/', auth, generateChatResponse);

module.exports = router;
