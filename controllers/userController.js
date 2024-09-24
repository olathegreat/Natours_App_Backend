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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // update unwanted document

  const filteredBody = filterObj(req.body, 'name', 'email');  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  }); 
 })


 exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }); 

  res.status(204).json({
    status: 'success',
    data: null,
  });

})