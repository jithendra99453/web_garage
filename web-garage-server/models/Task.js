const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  points: { type: Number, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
