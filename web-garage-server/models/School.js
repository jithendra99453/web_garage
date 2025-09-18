const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: true },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

module.exports = mongoose.model('School', SchoolSchema);
