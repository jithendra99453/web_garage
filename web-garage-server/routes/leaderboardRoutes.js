const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/leaderboard
// @desc    Get leaderboard data, filterable by school and class
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { school, classId } = req.query;

        // Build the filter object based on query parameters
        let filter = {};
        if (school && school !== 'all') {
            // Use a case-insensitive regex for school name matching
            filter.school = new RegExp(`^${school}$`, 'i');
        }
        if (classId && classId !== 'all') {
            filter.classId = classId;
        }

        // Find students based on the filter, sort by ecoPoints descending
        // Populate the 'classId' field to get the class name
        const students = await Student.find(filter)
            .sort({ ecoPoints: -1 }) // Assuming Student model has ecoPoints field
            .populate('classId', 'name') // Fetch the name from the referenced Class model
            .select('name ecoPoints school classId'); // Select only the necessary fields

        // Format the data to match the frontend's expectation
        const leaderboardData = students.map(student => ({
            id: student._id,
            name: student.name,
            ecoPoints: student.ecoPoints || 0, // Default to 0 if not present
            school: student.school,
            class: student.classId ? student.classId.name : 'N/A', // Safely access populated class name
            avatar: student.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }));

        res.json(leaderboardData);
    } catch (err) {
        console.error("Leaderboard Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
