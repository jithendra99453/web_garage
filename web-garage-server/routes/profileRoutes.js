const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Import all necessary models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const School = require('../models/School');







// ===============================================
//         GET USER PROFILE
// ===============================================
// @route   GET /api/profile
// @desc    Get profile for the currently logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // --- THIS IS NOW SAFE ---
    // Because all tokens have a req.user object with an id.
    const userId = req.user.id;
    const userRole = req.user.role;

    let userProfile;

    // Find the user in the correct collection based on their role
    if (userRole === 'student') {
      userProfile = await Student.findById(userId).select('-password');
    } else if (userRole === 'teacher' || userRole === 'school_admin') {
      // Assuming admins might be in the Teacher collection or a separate one
      userProfile = await Teacher.findById(userId).select('-password');
    } else {
        return res.status(404).json({ msg: 'User role not recognized.' });
    }

    if (!userProfile) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.json(userProfile);

  } catch (err) {
    console.error('Error in GET /api/profile:', err.message);
    res.status(500).send('Server Error');
  }
});
// ===============================================
//         UPDATE USER PROFILE
// ===============================================
// @route   PUT /api/profile
// @desc    Update the profile for the currently logged-in user
router.put('/', auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    const body = req.body;
    let updatedProfile;
    const profileFields = {};

    // Build the profileFields object based on the role and incoming data
    if (role === 'student') {
      if (body.name) profileFields.name = body.name;
      if (body.email) profileFields.email = body.email;
      if (body.school) profileFields.school = body.school;
      if (body.age) profileFields.age = body.age;
      if (body.educationType) profileFields.educationType = body.educationType;
      
      updatedProfile = await Student.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true }
      ).select('-password');

    } else if (role === 'teacher') {
      if (body.name) profileFields.name = body.name;
      if (body.email) profileFields.email = body.email;
      if (body.school) profileFields.school = body.school; // Assuming Teacher has a school field

      updatedProfile = await Teacher.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true }
      ).select('-password');

    } else if (role === 'school_admin') {
        if (body.schoolName) profileFields.schoolName = body.schoolName;
        if (body.adminEmail) profileFields.adminEmail = body.adminEmail;
        if (body.address) profileFields.address = body.address;
        
        updatedProfile = await School.findByIdAndUpdate(
            id,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');
    } else {
      return res.status(400).json({ msg: 'Invalid user role.' });
    }

    if (!updatedProfile) {
      return res.status(404).json({ msg: 'User not found for update' });
    }

    res.json(updatedProfile);

  } catch (err) {
    console.error('Error in PUT /api/profile:', err.message);
    res.status(500).send('Server Error');
  }
});

// ===============================================
//         UPDATE STUDENT POINTS
// ===============================================
// @route   PATCH /api/profile/points
// @desc    Add points to a student's total
// In web-garage-server/routes/profileRoutes.js

// @route   PATCH /api/profile/points
// @desc    Add points to a student's total
// In web-garage-server/routes/profileRoutes.js

// @route   PATCH /api/profile/points
// @desc    Add points to a student's total
router.patch('/points', auth, async (req, res) => {
  const { points } = req.body;
  const { role, id } = req.user;

  if (role !== 'student') {
    return res.status(403).json({ msg: 'Forbidden: Only students can earn points.' });
  }
  
  if (typeof points !== 'number' || points <= 0) {
    return res.status(400).json({ msg: 'Invalid points value.' });
  }

  try {
    // --- THE FIX IS HERE ---
    // Use the correct field name from your model: 'ecoPoints'
    const student = await Student.findByIdAndUpdate(
      id,
      { $inc: { ecoPoints: points } }, // Change totalPoints to ecoPoints
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ msg: 'Student not found.' });
    }

    // --- AND THE FIX IS HERE ---
    // Send back the correct field in the response
    res.json({ 
      message: `Successfully awarded ${points} points.`,
      newTotalPoints: student.ecoPoints // Change totalPoints to ecoPoints
    });

  } catch (err) {
    console.error('Error in PATCH /api/profile/points:', err.message);
    res.status(500).send('Server Error');
  }
});


// (Your GET and PUT routes remain the same)


module.exports = router;
