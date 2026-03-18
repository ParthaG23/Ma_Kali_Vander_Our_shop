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
const uploadRoutes = require('./routes/uploadRoute');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
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

app.options('*', cors());

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(mongoSanitize());

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Higher limit for uploads — image uploads are large and slow
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many upload requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Request parsing ───────────────────────────────────────────────────────────
// Increase limit for multipart/form-data (image uploads go through multer, not json parser)
app.use(express.json({ limit: '10kb' }));
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

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({
    success: true,
    status:  'OK',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  })
);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter,   authRoutes);
app.use('/api/khata',    apiLimiter,    khataRoutes);
app.use('/api/users',    apiLimiter,    userRoutes);
app.use('/api/products', apiLimiter,    productRoutes);
app.use('/api/upload',   uploadLimiter, uploadRoutes);

// ── 404 + Global error handler ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;