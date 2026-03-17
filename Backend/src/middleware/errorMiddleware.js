const logger = require('../utils/logger');

/**
 * 404 handler — catches any route not matched above.
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(err);
};

/**
 * Global error handler — must have 4 params for Express to treat it as error middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Determine status code
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Handle specific Mongoose / JWT error types
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    err.message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    err.message = `Duplicate value for ${field} — already exists`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    err.message = Object.values(err.errors).map((e) => e.message).join('; ');
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    err.message = 'Token expired — please log in again';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    err.message = 'Invalid token';
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} ${statusCode} — ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
