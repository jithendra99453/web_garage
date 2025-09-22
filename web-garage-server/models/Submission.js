const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  content: { type: String, required: true }, // Can be text, a URL to an image, etc.
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected'],
    default: 'pending',
  },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  submittedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
