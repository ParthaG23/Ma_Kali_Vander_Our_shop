/**
 * adminOnly — must be used AFTER protect middleware.
 * Blocks any non-admin user with a 403.
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Access denied — admins only' });
};

module.exports = { adminOnly };
