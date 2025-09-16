const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const School = require('../models/School');

// === STUDENT REGISTRATION ROUTE ===
router.post('/register/student', async (req, res) => {
  try {
    // Check if a student with this email already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }

    // In a real app, hash the password here before saving!
    const newStudent = new Student(req.body);
    await newStudent.save();
    
    res.status(201).json({ message: 'Student registered successfully!', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// === SCHOOL/TEACHER REGISTRATION ROUTE ===
router.post('/register/school', async (req, res) => {
  try {
    // Check if a school with this email already exists
    const existingSchool = await School.findOne({ email: req.body.email });
    if (existingSchool) {
      return res.status(400).json({ message: 'A school with this email already exists.' });
    }

    // In a real app, hash the password here!
    const newSchool = new School(req.body);
    await newSchool.save();
    
    res.status(201).json({ message: 'School registered successfully!', school: newSchool });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
