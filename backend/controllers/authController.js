const User = require('../models/userModel');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createTokenAndSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, photo, phone, profileFor, gender, age } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    photo,
    phone,
    profileFor,
    gender,
    age,
  });

  createTokenAndSendResponse(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  const isMatch = await user.isPasswordMatch(password, user.password);

  if (!user || !isMatch) {
    return next(new AppError('Invalid email or password!', 401));
  }

  createTokenAndSendResponse(user, 200, res);
});

exports.verifyToken = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You must log in to get access', 401));
  }

  const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(new AppError('The user with this Id no longer exists!', 401));
  }

  req.user = currentUser;
  next();
});
