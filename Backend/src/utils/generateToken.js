const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user.
 * @param {string} userId  - MongoDB _id
 * @param {string} role    - 'admin' | 'user'
 * @returns {string} signed JWT
 */
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment');
  return jwt.sign(
    { id: userId.toString(), role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d', issuer: 'grocery-shop-api' }
  );
};

module.exports = generateToken;
