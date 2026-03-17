const jwt                    = require('jsonwebtoken');
const asyncHandler           = require('express-async-handler');
const User                   = require('../models/User');
const { admin, isFirebaseReady } = require('../config/firebase');
const logger                 = require('../utils/logger');

/**
 * protect — verifies JWT (primary) or Firebase ID token (fallback).
 * Attaches req.user on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized — malformed token header');
  }

  // ── 1. Try JWT ──────────────────────────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'grocery-shop-api' });
    // Explicitly select password=false via schema; re-check isActive
    const user = await User.findOne({ _id: decoded.id, isActive: true });
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists or is deactivated');
    }
    req.user = user;
    return next();
  } catch (jwtErr) {
    // JsonWebTokenError / TokenExpiredError → fall through to Firebase
    // Any other error (DB) → rethrow
    if (!['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(jwtErr.name)) {
      throw jwtErr;
    }
    logger.debug(`JWT verify failed (${jwtErr.name}), trying Firebase…`);
  }

  // ── 2. Try Firebase ID token ────────────────────────────────────────
  if (!isFirebaseReady()) {
    res.status(401);
    throw new Error('Not authorized — invalid token');
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid, isActive: true });
    if (!user) {
      res.status(401);
      throw new Error('Firebase user is not registered in this system');
    }
    req.user = user;
    return next();
  } catch (fbErr) {
    logger.debug(`Firebase verify failed: ${fbErr.message}`);
    res.status(401);
    throw new Error('Not authorized — token is invalid or expired');
  }
});

module.exports = { protect };
