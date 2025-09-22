const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: { type: String, required: true },
  schoolName: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  ecoPoints: { type: Number, default: 0 },
  badges: [{ type: String }],
  
  // --- THIS IS THE FIX ---
  // Ensure these fields always exist as arrays, even if empty.
  tasks: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    default: [] 
  },
  submissions: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
    default: []
  },
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
