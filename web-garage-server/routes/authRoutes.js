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
// @route   POST /api/auth/register/school
// @desc    Register a new school admin account
// @access  Public
router.post('/register/school', async (req, res) => {
  // 1. Destructure the required fields from the request body
  const { schoolName, address, adminEmail, password } = req.body;

  // 2. Basic validation to ensure all fields are present
  if (!schoolName || !address || !adminEmail || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // 3. Check if a school with this email already exists
    let school = await School.findOne({ adminEmail });
    if (school) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // 4. Create a new school instance (password will be hashed by the pre-save hook in your model)
    school = new School({
      schoolName,
      address,
      adminEmail,
      password,
    });

    // 5. Save the new school to the database
    await school.save();

    // 6. Send a success response
    res.status(201).json({ message: 'School registered successfully! You can now log in.' });

  } catch (error) {
    // 7. Catch any other errors and send a generic server error response
    console.error('School Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

// @route   POST /api/auth/login/school
// @desc    Login for school admin
// @access  Public
router.post('/login/school', async (req, res) => {
    const { adminEmail, password } = req.body;

    if (!adminEmail || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        const school = await School.findOne({ adminEmail });
        if (!school) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // --- THIS IS THE CORRECTED PAYLOAD ---
        // It now matches the structure your dashboard route expects.
        const payload = {
            user: {
                id: school.id,
                schoolName: school.schoolName,
                role: 'school_admin' // Add the role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    schoolName: school.schoolName
                });
            }
        );

    } catch (error) {
        console.error('School Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
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
// @route   POST /api/auth/register/student
// @desc    Register a new student
// @access  Public
router.post('/register/student', async (req, res) => {
  // --- THIS IS THE FIX ---
  // Ensure 'classId' is being destructured from the request body.
  const { name, email, password, age, address, educationType, school, mentor, classId } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }
    
    // Log what the backend is receiving, just to be 100% sure
    console.log("Backend received student registration data:", req.body);

    // Create a new student instance with all the data, including classId
    student = new Student({
      name,
      email,
      password, // The model's pre-save hook will hash this
      age,
      address,
      educationType,
      school,
      mentor,
      classId, // This field is now correctly included
    });

    await student.save(); // The validation will now pass
    
    res.status(201).json({ message: 'Student account created successfully! Please log in.' });

  } catch (error) {
    // This is the error you were seeing. It will now be fixed.
    console.error('Student registration error:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});


// @route   POST /api/auth/login/student
// @desc    Authenticate a student and return a token
// @access  Public
router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the student by their email
    const student = await Student.findOne({ email });
    if (!student) {
      // It's best practice to return the same generic error for both wrong email and wrong password
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 2. Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. If credentials match, create the JWT payload
    const payload = {
      user: {
        id: student.id,
        role: 'student', // Set the role explicitly
      },
    };

    // 4. Sign the token and send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Or your preferred expiration time
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Student login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
