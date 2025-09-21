const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import all necessary database models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const School = require('../models/School'); // For school-level admin registration

// ===============================================
//         SCHOOL ADMIN AUTHENTICATION
// ===============================================

// @route   POST /api/auth/register/school
// @desc    Register a new school admin account
router.post('/register/school', async (req, res) => {
  const { schoolName, address, adminEmail, password } = req.body;

  try {
    let school = await School.findOne({ adminEmail });
    if (school) {
      return res.status(400).json({ message: 'A school with this admin email already exists.' });
    }

    school = new School({ schoolName, address, adminEmail, password });
    await school.save(); // The pre-save hook in the model will hash the password

    res.status(201).json({ message: 'School account registered successfully!' });
  } catch (error) {
    console.error('School registration error:', error.message);
    res.status(500).json({ message: 'Server error during school registration.' });
  }
});

// @route   POST /api/auth/login/school
// @desc    Authenticate a school admin and return a token
router.post('/login/school', async (req, res) => {
  const { adminEmail, password } = req.body;

  try {
    const school = await School.findOne({ adminEmail });
    if (!school) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: school.id,
        role: 'school_admin',
        schoolName: school.schoolName,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, schoolName: school.schoolName });
      }
    );
  } catch (error) {
    console.error('School login error:', error.message);
    res.status(500).json({ message: 'Server error during school login.' });
  }
});

// ===============================================
//         TEACHER AUTHENTICATION
// ===============================================

// @route   POST /api/auth/register/teacher
// @desc    Register a new teacher
router.post('/register/teacher', async (req, res) => {
  const { name, email, password, school } = req.body;

  try {
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ message: 'A teacher with this email already exists.' });
    }

    teacher = new Teacher({ name, email, password, school });
    await teacher.save();
    res.status(201).json({ message: 'Teacher account registered successfully!' });
  } catch (error) {
    console.error('Teacher registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login/teacher
// @desc    Authenticate a teacher and return a token
router.post('/login/teacher', async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: teacher.id,
        role: 'teacher',
        name: teacher.name,
        school: teacher.school,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Teacher login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ===============================================
//         STUDENT AUTHENTICATION
// ===============================================

// @route   POST /api/auth/register/student
// @desc    Register a new student
router.post('/register/student', async (req, res) => {
  const { name, email, password, age, address, educationType, school, mentor } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name, email, password: hashedPassword, age, address, educationType, school, mentor,
    });

    await student.save();
    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (error) {
    console.error('Student registration error:', error.message);
    res.status(500).json({ message: 'Server error during student registration.' });
  }
});

// @route   POST /api/auth/login/student
// @desc    Authenticate a student and return a JWT
router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const payload = {
      user: {
        id: student.id,
        role: 'student',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Student login error:', error.message);
    res.status(500).json({ message: 'Server error during student login.' });
  }
});

module.exports = router;
