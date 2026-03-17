const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables');

  const options = {
    maxPoolSize:       10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS:   45000,
  };

  mongoose.connection.on('connected',    () => logger.info(`MongoDB connected: ${mongoose.connection.host}`));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error',        (err) => logger.error(`MongoDB error: ${err.message}`));

  await mongoose.connect(uri, options);
};

module.exports = connectDB;
