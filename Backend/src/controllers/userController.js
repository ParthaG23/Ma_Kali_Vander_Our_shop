const asyncHandler = require('express-async-handler');
const User         = require('../models/User');

/**
 * @desc   Get all users
 * @route  GET /api/users
 * @access Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, count: users.length, data: users });
});

/**
 * @desc   Get single user
 * @route  GET /api/users/:id
 * @access Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, data: user });
});

/**
 * @desc   Update user role
 * @route  PUT /api/users/:id/role
 * @access Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Role must be "user" or "admin"');
  }
  // Prevent admin from demoting themselves
  if (req.params.id === req.user._id.toString() && role !== 'admin') {
    res.status(400);
    throw new Error('You cannot change your own role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, data: user });
});

/**
 * @desc   Toggle user active status
 * @route  PUT /api/users/:id/toggle-active
 * @access Admin
 */
const toggleUserActive = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, data: { _id: user._id, isActive: user.isActive, message: `User ${user.isActive ? 'activated' : 'deactivated'}` } });
});

/**
 * @desc   Hard-delete user
 * @route  DELETE /api/users/:id
 * @access Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  res.json({ success: true, data: { message: 'User deleted permanently' } });
});

module.exports = { getAllUsers, getUserById, updateUserRole, toggleUserActive, deleteUser };
