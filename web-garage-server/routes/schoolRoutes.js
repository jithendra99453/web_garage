const express = require('express');
const router = express.Router();
const School = require('../models/School'); // Adjust path if necessary

// @route   GET /api/schools
// @desc    Get a list of all registered school names
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all schools and select only the schoolName field, sorting alphabetically
    const schools = await School.find({}).sort({ schoolName: 1 }).select('schoolName');
    
    // Extract just the names into a simple array of strings
    const schoolNames = schools.map(school => school.schoolName);
    
    res.json(schoolNames);
  } catch (error) {
    console.error('Error fetching schools:', error.message);
    res.status(500).json({ message: 'Server error while fetching schools.' });
  }
});

module.exports = router;
