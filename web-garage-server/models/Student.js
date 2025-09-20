const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: true },
  educationType: { type: String, required: true },
  totalPoints: { type: Number, default: 0 } ,
  profilePicture: { type: String, default: null }, // Add this line
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

module.exports = mongoose.model('Student', StudentSchema);
