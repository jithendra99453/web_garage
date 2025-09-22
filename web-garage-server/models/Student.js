const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  address: { type: String },
  educationType: { type: String },
  school: { type: String, required: true },
  ecoPoints: { type: Number, default: 0 },
  
  mentor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  },
  
  // --- THIS IS THE FIX ---
  // Add the reference to the Class model.
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },

}, { timestamps: true });

// Password hashing middleware
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Student', StudentSchema);
