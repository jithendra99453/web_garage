// web-garage-server/controllers/profileController.js

const Student = require('../models/Student');
const School = require('../models/School'); // Make sure to require the School model

// @desc    Get logged-in user's profile (for either Student or School)
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // req.user is attached by your auth middleware and should contain id and role
    const { id, role } = req.user;

    let userProfile;

    // Check the user's role and query the correct collection
    if (role === 'school') {
      userProfile = await School.findById(id).select('-password');
    } else if (role === 'student') {
      userProfile = await Student.findById(id).select('-password');
    }

    // If no profile is found for the given role and ID
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

    if (role === 'school') {
      // Logic to update school profile
      const { school, email } = req.body;
      const profileFields = {};
      if (school) profileFields.school = school;
      if (email) profileFields.email = email;
      
      updatedProfile = await School.findByIdAndUpdate(
        id,
        { $set: profileFields },
        { new: true }
      ).select('-password');

    } else if (role === 'student') {
      // Your existing logic to update student profile
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
        { new: true }
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
