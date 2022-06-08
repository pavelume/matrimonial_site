const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Email is a required field!'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password!'],
    minlength: [8, 'Password must be at least 8 characters long!'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords must be the same',
    },
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },

  phone: {
    type: Number,
    required: [true, 'Please provide your phone number!'],
    minlength: [11, 'Phone number must be at least 11 characters long!'],
  },
  profileFor: {
    type: String,
    required: [true, 'Please mention on behalf of whom your are looking for!'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },

  age: {
    type: Number,
    required: [true, 'Please mention your age!'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.isPasswordMatch = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
