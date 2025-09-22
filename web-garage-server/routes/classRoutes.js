const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Class = require('../models/Class');
// --- THIS IS THE FIX ---
// You must import the Teacher model to use it.
const Teacher = require('../models/Teacher'); 

// @route   POST /api/classes
// @desc    Create a new class for the logged-in teacher
// @access  Private (Teacher)
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'Class name is required.' });
    }

    try {
        // This line was causing the crash because 'Teacher' was not defined.
        const teacher = await Teacher.findById(req.user.id);
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found.' });
        }

        const newClass = new Class({
            name,
            schoolName: teacher.school, // Assumes 'school' is the field name on the Teacher model
            teacher: req.user.id        
        });

        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (err) {
        console.error("Error creating class:", err.message);
        res.status(500).send('Server Error');
    }
});

// This route is for the student sign-up form
// @route   GET /api/classes/teacher/:teacherId
// @desc    Get all classes for a specific teacher
// @access  Public
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.params.teacherId }).select('_id name');
        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// This route is for the teacher dashboard
// @route   GET /api/classes
// @desc    Get all classes for a specific school
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const schoolName = req.query.school;
        if (!schoolName) {
            return res.status(400).json({ msg: 'School name is required.' });
        }
        const classes = await Class.find({ schoolName: schoolName }).populate('students', 'name');
        res.json(classes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
