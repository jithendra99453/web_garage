require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/QuizRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

console.log('--- Mounting /api/profile router ---');
// --- API Routes (Updated Order and Specificity) ---
// By using '/api/auth', we avoid conflicts with other routes.
app.use('/api/auth', authRoutes); 
app.use('/api/quiz', quizRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes); 

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
