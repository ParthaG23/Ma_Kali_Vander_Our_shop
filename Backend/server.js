'use strict';
require('dotenv').config();

const app = require("./src/app");
const connectDB   = require('./src/config/db');
const { initFirebase } = require('./src/config/firebase');
const logger      = require('./src/utils/logger');

const PORT = parseInt(process.env.PORT, 10) || 5000;

// ── Validate critical env vars before anything starts ────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  logger.error('Copy server/.env.example to server/.env and fill in the values');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  logger.error('JWT_SECRET must be at least 32 characters long for security');
  process.exit(1);
}

// ── Graceful shutdown handler ─────────────────────────────────────────────────
let server;

const gracefulShutdown = (signal) => {
  logger.warn(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  // Force exit after 10s if connections are not closed
  setTimeout(() => {
    logger.error('Could not close connections in time — forcing exit');
    process.exit(1);
  }, 10_000);
};

// ── Boot sequence ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Init Firebase (optional — does not block startup)
    initFirebase();

    // 3. Start HTTP server
    server = app.listen(PORT, () => {
      logger.info('─────────────────────────────────────────');
      logger.info(`  GroceryShop API running`);
      logger.info(`  Port    : ${PORT}`);
      logger.info(`  Mode    : ${process.env.NODE_ENV || 'development'}`);
      logger.info(`  Health  : http://localhost:${PORT}/api/health`);
      logger.info('─────────────────────────────────────────');
    });

    // Handle server-level errors (e.g. port already in use)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Change PORT in .env`);
      } else {
        logger.error(`Server error: ${err.message}`);
      }
      process.exit(1);
    });

    // 4. Register shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
};

// ── Unhandled rejection / exception guards ────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

start();
