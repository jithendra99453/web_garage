const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const School = require('../models/School'); // <-- 1. IMPORT THE SCHOOL MODEL


console.log('--- profileRoutes.js file has been loaded and is being registered ---'); // <-- ADD THIS

// --- ADD THIS UNPROTECTED TEST ROUTE ---
router.get('/test', (req, res) => {
  console.log('>>> SUCCESS: /api/profile/test route was hit!');
  res.send('Profile test route is working!');
});



// @route   GET /api/profile
router.get('/', auth, async (req, res) => {
  console.log('>>> Step 1: Entered /api/profile route handler.'); // New Log

  try {
    const { id, role } = req.user;
    console.log(`>>> Step 2: User ID is "${id}", Role is "${role}".`); // New Log

    let userProfile;

    if (role === 'school' || role === 'teacher') { // Check for both 'school' and 'teacher' just in case
      console.log('>>> Step 3: Searching in School collection...'); // New Log
      userProfile = await School.findById(id).select('-password');
      console.log('>>> Step 4: School.findById result:', userProfile); // New Log

    } else if (role === 'student') {
      console.log('>>> Step 3: Searching in Student collection...'); // New Log
      userProfile = await Student.findById(id).select('-password');
      console.log('>>> Step 4: Student.findById result:', userProfile); // New Log

    } else {
      console.log(`>>> ERROR: Role is invalid: "${role}"`); // New Log
      return res.status(400).json({ msg: 'Invalid user role in token' });
    }

    if (!userProfile) {
      console.log('>>> ERROR: User profile was not found in the database.'); // New Log
      return res.status(404).json({ msg: 'User not found in database' });
    }

    console.log('>>> SUCCESS: User profile found. Sending response.'); // New Log
    res.json(userProfile);

  } catch (err) {
    console.error('>>> CATCH BLOCK ERROR in /api/profile:', err); // New Log
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/profile
// @desc    Update logged-in user's profile
router.put('/', auth, async (req, res) => {
    // This route also needs to be role-aware, but we can fix the GET route first.
    // The logic will be similar to the GET route above.
    // For now, let's focus on fixing the login loop.
    res.status(501).json({ msg: 'Update not yet implemented for all roles.' });
});


// --- ADD THIS NEW ROUTE ---
// @route   PATCH /api/profile/points
// @desc    Add points to a user's total
router.patch('/points', auth, async (req, res) => {
  const { points } = req.body;

  // Basic validation
  if (typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ msg: 'Invalid points value.' });
  }

  try {
    // Use MongoDB's $inc operator to atomically increment the points
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $inc: { totalPoints: points } },
      { new: true } // This option returns the updated document
    ).select('totalPoints');

    if (!student) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Send back the new total
    res.json({ totalPoints: student.totalPoints });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
