const express        = require('express');
const multer         = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect }    = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Log config on startup to verify env vars are loaded ──────────────────────
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY ? '✓ set' : '✗ MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ set' : '✗ MISSING',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'groceryshop/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 600, height: 600, crop: 'fill', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post('/image', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success:  true,
    url:      req.file.path,
    publicId: req.file.filename,
  });
});

// ── Catch multer/cloudinary errors and return readable message ────────────────
router.use((err, req, res, next) => {
  console.error('Upload error:', err);
  res.status(500).json({ success: false, message: err.message || 'Upload failed' });
});

module.exports = router;