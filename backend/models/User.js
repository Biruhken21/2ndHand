const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// FIXED: Password hashing middleware
// userSchema.pre('save', async function(next) {
//   // Only hash the password if it's modified (or new)
//   if (!this.isModified('password')) return next();
  
//   try {
//     // Generate salt
//     const salt = await bcrypt.genSalt(10);
//     // Hash password
//     this.password = await bcrypt.hash(this.password, salt);
//     return next(); // Added return
//   } catch (error) {
//     return next(error); // Added return
//   }
// });

// Alternative: Simpler version without next() issues
userSchema.pre('save', async function() {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return;
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model('User', userSchema);