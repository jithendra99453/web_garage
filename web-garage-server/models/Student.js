const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String },
  educationType: { type: String, required: true },
  school: { type: String, required: true },
  mentor: { type: String },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

module.exports = mongoose.model('Student', StudentSchema);
