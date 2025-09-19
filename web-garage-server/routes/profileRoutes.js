const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Student = require('../models/Student');

// @route   GET /api/profile
// @desc    Get logged-in user's profile
router.get('/', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile
// @desc    Update logged-in user's profile
router.put('/', auth, async (req, res) => {
  const { name, email, school, educationType, profilePicture } = req.body;

  try {
    let student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ msg: 'User not found' });
    }

    student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email, school, educationType, profilePicture } },
      { new: true }
    ).select('-password');

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
