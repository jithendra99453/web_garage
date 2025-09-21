// backend/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 1,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Assuming you have a 'Class' model
    required: true,
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assuming you have a 'Student' model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
