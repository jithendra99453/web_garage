const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // 1. Import the middleware
const Task = require('../models/Task');
const Teacher = require('../models/Teacher'); // Import Teacher to verify role

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private (Teacher Only)
router.post('/', auth, async (req, res) => { // 2. Add 'auth' middleware here
  const { title, description, dueDate, points, classId, assignedTo } = req.body;

  if (!title || !description || !dueDate || !points || !classId) {
    return res.status(400).json({ msg: 'Please enter all required fields.' });
  }

  try {
    // 3. Authorization: Check if the user is actually a teacher
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
        return res.status(403).json({ msg: 'Access denied. Only teachers can create tasks.' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      points,
      classId, // Assuming this is a reference to your Class model
      assignedTo,
      teacher: req.user.id, // 4. Save the ID of the teacher who created the task
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/student/:studentId
// @desc    Get all tasks assigned to a specific student
// @access  Private (Student or Teacher)
router.get('/student/:studentId', auth, async (req, res) => { // 5. Also protect this route
  try {
    const studentId = req.params.studentId;

    // Authorization check: Ensure the person requesting is either the student themselves
    // or a teacher from the same school. (This logic can be enhanced).
    if (req.user.id !== studentId && req.user.role !== 'teacher' && req.user.role !== 'school_admin') {
        return res.status(403).json({ msg: 'Access denied.' });
    }

    const tasks = await Task.find({ assignedTo: studentId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ msg: 'No tasks found for this student' });
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
