const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// @route   GET /api/dashboard/school-data
// @desc    Get all teachers, students, and stats for the logged-in admin's school
// @access  Private (for school_admin)
router.get('/school-data', auth, async (req, res) => {
  // Ensure the user has the correct role
  if (req.user.role !== 'school_admin') {
    return res.status(403).json({ msg: 'Access denied. Not a school admin.' });
  }

  try {
    const schoolName = req.user.schoolName;

    // 1. Find all teachers belonging to this school
    const teachers = await Teacher.find({ schoolName: schoolName }).select('-password');

    // 2. Find all students belonging to this school
    const students = await Student.find({ school: schoolName }).select('-password');

    // 3. Calculate the total coins from all students
    const totalEcoPoints = students.reduce((sum, student) => sum + (student.totalPoints || 0), 0);
    
    // 4. Get the leaderboard of top 5 students
    const leaderboard = await Student.find({ school: schoolName })
      .sort({ totalPoints: -1 }) // Sort by points, descending
      .limit(5)
      .select('name totalPoints'); // Select only the fields you need

    // Send all the data back in one response
    res.json({
      stats: {
        teachers: teachers.length,
        students: students.length,
        ecoPoints: totalEcoPoints,
      },
      teachers,
      leaderboard,
    });

  } catch (err) {
    console.error('Error fetching school dashboard data:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
