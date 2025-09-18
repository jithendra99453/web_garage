const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/QuizRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Database Connection (Updated) ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// --- API Routes ---
app.use('/api', authRoutes);
app.use('/api/quiz', quizRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
