const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher'); // Correctly import the Teacher model

// --- Test Route (Good for debugging) ---
router.get('/test', (req, res) => {
  console.log('>>> SUCCESS: /api/profile/test route was hit!');
  res.send('Profile test route is working!');
});

// @route   GET /api/profile
// @desc    Get profile for logged-in user (student or teacher)
router.get('/', auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    let userProfile;

    if (role === 'teacher') {
      userProfile = await Teacher.findById(id).select('-password');
    } else if (role === 'student') {
      userProfile = await Student.findById(id).select('-password');
    } else {
      return res.status(400).json({ msg: 'Invalid user role in token' });
    }

    if (!userProfile) {
      return res.status(404).json({ msg: 'User not found in database' });
    }

    res.json(userProfile);

  } catch (err) {
    console.error('Error in GET /api/profile:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile
// @desc    Update logged-in user's profile
router.put('/', auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    const body = req.body;
    let updatedProfile;

    if (role === 'teacher') {
      // Build the fields object for the teacher role
      const profileFields = {};
      if (body.name) profileFields.name = body.name;
      if (body.email) profileFields.email = body.email;
      if (body.schoolName) profileFields.schoolName = body.schoolName;
      if (body.subject) profileFields.subject = body.subject;
      
      updatedProfile = await Teacher.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true }
      ).select('-password');

    } else if (role === 'student') {
      // Build the fields object for the student role
      const profileFields = {};
      if (body.name) profileFields.name = body.name;
      if (body.email) profileFields.email = body.email;
      if (body.school) profileFields.school = body.school;
      if (body.educationType) profileFields.educationType = body.educationType;
      if (body.profilePicture) profileFields.profilePicture = body.profilePicture;

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

// @route   PATCH /api/profile/points
// @desc    Add points to a student's total (only applicable to students)
router.patch('/points', auth, async (req, res) => {
  const { points } = req.body;
  const { role, id } = req.user;

  // This route should only be for students
  if (role !== 'student') {
    return res.status(403).json({ msg: 'Forbidden: Only students can have points updated.' });
  }
  
  if (typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ msg: 'Invalid points value.' });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      id,
      { $inc: { totalPoints: points } },
      { new: true }
    ).select('totalPoints');

    if (!student) {
      return res.status(404).json({ msg: 'Student not found.' });
    }

    res.json({ totalPoints: student.totalPoints });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
