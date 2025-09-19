const Student = require('../models/Student');

// @desc    Get logged-in user's profile
// @route   GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    // req.user.id is attached by the auth middleware
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/profile
exports.updateProfile = async (req, res) => {
  const { name, email, school, educationType, profilePicture } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (email) profileFields.email = email;
  if (school) profileFields.school = school;
  if (educationType) profileFields.educationType = educationType;
  if (profilePicture) profileFields.profilePicture = profilePicture;

  try {
    let student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ msg: 'User not found' });
    }

    student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true } // Return the updated document
    ).select('-password');

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
