const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.getAllUsers = catchAsync( async (req, res, next) => {
 const users = await User.find();


 res.status(200).json({
  status: 'success',
  results: users.length,
  data: {
    users,
  },
 });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet',
  });
};

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet',
  });
};

exports.updateUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet',
  });
};

exports.deleteUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet',
  });
};
