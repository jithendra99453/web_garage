const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import your database models
const Student = require('../models/Student');
const School = require('../models/School');

// ===============================================
//          STUDENT AUTHENTICATION ROUTES
// ===============================================

// @route   POST /api/register/student
// @desc    Register a new student
router.post('/register/student', async (req, res) => {
  const { name, email, password, age, address, educationType, school, mentor } = req.body;

  try {
    // Check if a student with this email already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student instance with the hashed password
    student = new Student({
      name,
      email,
      password: hashedPassword,
      age,
      address,
      educationType,
      school,
      mentor,
    });

    // Save the new student to the database
    await student.save();

    res.status(201).json({ message: 'Student registered successfully!' });

  } catch (error) {
    console.error('Student registration error:', error.message);
    res.status(500).json({ message: 'Server error during student registration.' });
  }
});

// @route   POST /api/login/student
// @desc    Authenticate a student and return a JWT
router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the student exists in the database
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    // If credentials are correct, create and sign a JWT
    const payload = {
      user: {
        id: student.id,
        role: 'student',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from the .env file
      { expiresIn: '1h' }, // Token will expire in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send the token back to the client
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Student login error:', error.message);
    res.status(500).json({ message: 'Server error during student login.' });
  }
});


// ===============================================
//          SCHOOL/TEACHER AUTHENTICATION ROUTES
// ===============================================

// @route   POST /api/register/school
// @desc    Register a new school/teacher
router.post('/register/school', async (req, res) => {
    const { email, password, school } = req.body;

    try {
        let schoolUser = await School.findOne({ email });
        if (schoolUser) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        schoolUser = new School({
            email,
            password: hashedPassword,
            school,
        });

        await schoolUser.save();

        res.status(201).json({ message: 'School account registered successfully!' });

    } catch (error) {
        console.error('School registration error:', error.message);
        res.status(500).json({ message: 'Server error during school registration.' });
    }
});

// @route   POST /api/login/school
// @desc    Authenticate a school/teacher and return a JWT
router.post('/login/school', async (req, res) => {
    const { email, password } = req.body;

    try {
        const schoolUser = await School.findOne({ email });
        if (!schoolUser) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, schoolUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: schoolUser.id,
                role: 'teacher',
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
        console.error('School login error:', error.message);
        res.status(500).json({ message: 'Server error during school login.' });
    }
});


module.exports = router;




// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Import your database models
// const Student = require('../models/Student');
// const School = require('../models/School');

// // ===============================================
// //          STUDENT AUTHENTICATION ROUTES
// // ===============================================

// // @route   POST /api/register/student
// // @desc    Register a new student
// router.post('/register/student', async (req, res) => {
//   const { name, email, password, age, address, educationType, school, mentor } = req.body;

//   try {
//     // Check if a student with this email already exists
//     let student = await Student.findOne({ email });
//     if (student) {
//       return res.status(400).json({ message: 'A student with this email already exists.' });
//     }

//     // Hash the password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create and save new student
//     student = new Student({
//       name,
//       email,
//       password: hashedPassword,
//       age,
//       address,
//       educationType,
//       school,
//       mentor,
//     });

//     await student.save();
//     res.status(201).json({ message: 'Student registered successfully!' });

//   } catch (error) {
//     console.error('Student registration error:', error.message);
//     res.status(500).json({ message: 'Server error during student registration.' });
//   }
// });

// // @route   POST /api/login/student
// // @desc    Authenticate a student and return a JWT
// router.post('/login/student', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
//     }

//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials. Please check your email and password.' });
//     }

//     const payload = {
//       user: {
//         id: student.id,
//         role: 'student',
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );

//   } catch (error) {
//     console.error('Student login error:', error.message);
//     res.status(500).json({ message: 'Server error during student login.' });
//   }
// });

// // ===============================================
// //          SCHOOL / TEACHER AUTHENTICATION ROUTES
// // ===============================================

// // @route   POST /api/register/school
// // @desc    Register a new school/teacher
// router.post('/register/school', async (req, res) => {
//   const { email, password, school } = req.body;

//   try {
//     let schoolUser = await School.findOne({ email });
//     if (schoolUser) {
//       return res.status(400).json({ message: 'A user with this email already exists.' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     schoolUser = new School({
//       email,
//       password: hashedPassword,
//       school,
//     });

//     await schoolUser.save();
//     res.status(201).json({ message: 'School account registered successfully!' });

//   } catch (error) {
//     console.error('School registration error:', error.message);
//     res.status(500).json({ message: 'Server error during school registration.' });
//   }
// });

// // @route   POST /api/login/school
// // @desc    Authenticate a school/teacher and return a JWT
// router.post('/login/school', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const schoolUser = await School.findOne({ email });
//     if (!schoolUser) {
//       return res.status(400).json({ message: 'Invalid credentials.' });
//     }

//     const isMatch = await bcrypt.compare(password, schoolUser.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials.' });
//     }

//     const payload = {
//       user: {
//         id: schoolUser.id,
//         role: 'teacher',
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );

//   } catch (error) {
//     console.error('School login error:', error.message);
//     res.status(500).json({ message: 'Server error during school login.' });
//   }
// });

// module.exports = router;
