const asyncHandler  = require('express-async-handler');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');
const { admin, isFirebaseReady } = require('../config/firebase');
const logger        = require('../utils/logger');

// ── Helpers ──────────────────────────────────────────────────────────────────

const userPayload = (user, token) => ({
  _id:   user._id,
  name:  user.name,
  email: user.email,
  role:  user.role,
  token,
});

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * @desc   Register new user with email + password
 * @route  POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;  // body already validated by Joi

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',  // only allow admin if explicitly passed
  });

  logger.info(`New user registered: ${email} (${user.role})`);
  res.status(201).json({ success: true, data: userPayload(user, generateToken(user._id, user.role)) });
});

/**
 * @desc   Login with email + password
 * @route  POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly include password (it's excluded by schema default)
  const user = await User.findOne({ email, isActive: true }).select('+password');

  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Update last login timestamp (non-blocking)
  User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).exec();

  logger.info(`User logged in: ${email}`);
  res.json({ success: true, data: userPayload(user, generateToken(user._id, user.role)) });
});

/**
 * @desc   Login / register via Firebase ID token (Google, etc.)
 * @route  POST /api/auth/firebase
 * @access Public
 */
const firebaseAuth = asyncHandler(async (req, res) => {
  const { firebaseToken } = req.body;

  if (!firebaseToken) {
    res.status(400);
    throw new Error('firebaseToken is required');
  }

  if (!isFirebaseReady()) {
    res.status(503);
    throw new Error('Google login is not configured on this server');
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(firebaseToken);
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired Firebase token');
  }

  const { uid, email, name: fbName } = decoded;

  // Find by Firebase UID first
  let user = await User.findOne({ firebaseUid: uid, isActive: true });

  if (!user) {
    // Try to link to existing account with same email
    user = await User.findOne({ email, isActive: true });
    if (user) {
      user.firebaseUid = uid;
      await user.save();
      logger.info(`Firebase linked to existing account: ${email}`);
    } else {
      // Create brand new user
      user = await User.create({ name: fbName || email, email, firebaseUid: uid, role: 'user' });
      logger.info(`New user via Firebase: ${email}`);
    }
  }

  User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).exec();
  res.json({ success: true, data: userPayload(user, generateToken(user._id, user.role)) });
});

/**
 * @desc   Get current logged-in user
 * @route  GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

/**
 * @desc   Change password
 * @route  PUT /api/auth/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('currentPassword and newPassword are required');
  }
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user.password) {
    res.status(400);
    throw new Error('This account uses Google login — password change not applicable');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, data: { message: 'Password updated successfully' } });
});

module.exports = { register, login, firebaseAuth, getMe, changePassword };
