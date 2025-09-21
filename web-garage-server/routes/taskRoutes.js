// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Import the Task model

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private (add authentication middleware as needed)
router.post('/', async (req, res) => {
  const { title, description, dueDate, points, classId, assignedTo } = req.body;

  // Basic validation
  if (!title || !description || !dueDate || !points || !classId) {
    return res.status(400).json({ msg: 'Please enter all required fields.' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      points,
      classId,
      assignedTo,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// backend/routes/taskRoutes.js

// ... existing router setup and POST route ...

// @route   GET api/tasks/student/:studentId
// @desc    Get all tasks assigned to a specific student
// @access  Private (You would protect this route)
router.get('/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find all tasks where the 'assignedTo' array contains the student's ID
    const tasks = await Task.find({ assignedTo: studentId });

    if (!tasks) {
      return res.status(404).json({ msg: 'No tasks found for this student' });
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
