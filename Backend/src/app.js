const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const compression    = require('compression');
const rateLimit      = require('express-rate-limit');
const mongoSanitize  = require('express-mongo-sanitize');
const logger         = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ── Routes ───────────────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const khataRoutes   = require('./routes/khataRoutes');
const userRoutes    = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// THIS is the #1 cause of "Network Error" — must be first, before any route
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    },
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle pre-flight OPTIONS requests for all routes
app.options('*', cors());

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Sanitize MongoDB query injection ($set, $where, etc.)
app.use(mongoSanitize());

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Strict limit on auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Request parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));        // body size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
      skip: (req) => req.path === '/api/health',
    })
  );
}

// ── Health check (no auth, no rate limit) ────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({
    success: true,
    status:  'OK',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter,  authRoutes);
app.use('/api/khata',    apiLimiter,   khataRoutes);
app.use('/api/users',    apiLimiter,   userRoutes);
app.use('/api/products', apiLimiter,   productRoutes);

// ── 404 + Global error handler ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
