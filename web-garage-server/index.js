require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teacherRoutes = require('./routes/teacherRoutes'); // NEW
const classRoutes = require('./routes/classRoutes');     // NEW
const submissionRoutes = require('./routes/submissionRoutes'); // NEW
const quizRoutes = require('./routes/QuizRoutes');
const chatRoutes = require('./routes/chatRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE SETUP ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// --- API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/schools', schoolRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teacher', teacherRoutes);         // NEW
app.use('/api/classes', classRoutes);           // NEW
app.use('/api/submissions', submissionRoutes);  // NEW
app.use('/api/quiz', quizRoutes);
app.use('/api/chat', chatRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
