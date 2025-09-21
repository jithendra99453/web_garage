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
  try {
    const { id, role } = req.user;
    const { name, email, school, educationType, profilePicture } = req.body;

    let updatedProfile;
    let profileFields = {};

    // Check which role is being updated
    if (role === 'school' || role === 'teacher') {
      // Build the fields object only for the school/teacher role
      if (email) profileFields.email = email;
      if (school) profileFields.school = school;
      
      updatedProfile = await School.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true } // 'new: true' returns the updated document
      ).select('-password');

    } else if (role === 'student') {
      // Build the fields object only for the student role
      if (name) profileFields.name = name;
      if (email) profileFields.email = email;
      if (school) profileFields.school = school;
      if (educationType) profileFields.educationType = educationType;
      if (profilePicture) profileFields.profilePicture = profilePicture;

      updatedProfile = await Student.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true }
      ).select('-password');
    } else {
        return res.status(400).json({ msg: 'Invalid user role.' });
    }

    if (!updatedProfile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(updatedProfile);

  } catch (err) {
    console.error('Error in PUT /api/profile:', err.message);
    res.status(500).send('Server Error');
  }
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
