const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  school: { 
    type: String, 
    required: true 
  },
  // You can add more teacher-specific fields here later
  // e.g., fullName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);
