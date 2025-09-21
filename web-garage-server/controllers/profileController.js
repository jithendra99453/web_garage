// web-garage-server/controllers/profileController.js

const Student = require('../models/Student');
const Teacher = require('../models/Teacher'); // CORRECT: Import Teacher model

// @desc    Get logged-in user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    let userProfile;

    // CORRECT: Check for the 'teacher' role
    if (role === 'teacher') {
      // CORRECT: Use the Teacher model
      userProfile = await Teacher.findById(id).select('-password');
    } else if (role === 'student') {
      userProfile = await Student.findById(id).select('-password');
    }

    if (!userProfile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    let updatedProfile;

    // CORRECT: Check for 'teacher' role
    if (role === 'teacher') {
      const { name, email, schoolName, subject } = req.body;
      const profileFields = {};
      if (name) profileFields.name = name;
      if (email) profileFields.email = email;
      if (schoolName) profileFields.schoolName = schoolName; // Use schoolName if that's the field
      if (subject) profileFields.subject = subject;
      
      updatedProfile = await Teacher.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true } // Added runValidators
      ).select('-password');

    } else if (role === 'student') {
      const { name, email, school, educationType, profilePicture } = req.body;
      const profileFields = {};
      if (name) profileFields.name = name;
      if (email) profileFields.email = email;
      if (school) profileFields.school = school;
      if (educationType) profileFields.educationType = educationType;
      if (profilePicture) profileFields.profilePicture = profilePicture;

      updatedProfile = await Student.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true, runValidators: true } // Added runValidators
      ).select('-password');
    }

    if (!updatedProfile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
