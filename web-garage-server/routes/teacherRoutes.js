const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

// --- YOUR EXISTING DASHBOARD ROUTE (No changes needed) ---
router.get('/dashboard', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    // This route uses 'schoolName' which is correct if your Teacher model has that field.
    // If your Teacher model uses 'school', you should change this line as well.
    const schoolName = teacher.schoolName || teacher.school; 
    const classes = await Class.find({ schoolName: schoolName }).populate('students', 'name');
    
    res.json({
      teacherData: teacher,
      classData: classes,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- UPDATED TEACHER FETCHING ROUTE ---
// @route   GET /api/teacher
// @desc    Get teachers, filtered by school name (case-insensitive)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { schoolName } = req.query;

        console.log("Backend received request for school:", schoolName); // Keep this for debugging

        if (!schoolName) {
            return res.status(400).json({ message: 'A school name query parameter is required.' });
        }

        const searchPattern = new RegExp(`^${schoolName}$`, 'i');

        // --- THIS IS THE FIX ---
        // Change 'schoolName' to 'school' to match your database documents.
        const teachers = await Teacher.find({ school: searchPattern }).select('_id name');
        
        console.log("Found teachers:", teachers); // Log the result to confirm it works
        
        res.json(teachers);
    } catch (err) {
        console.error('Error fetching teachers:', err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.params.teacherId }).select('_id name');
        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
