const express = require('express');
const router  = express.Router();
const { register, login, firebaseAuth, getMe, changePassword } = require('../controllers/authController');
const { protect }  = require('../middleware/authMiddleware');
const { validate, registerSchema, loginSchema } = require('../utils/validate');

router.post('/register',        validate(registerSchema), register);
router.post('/login',           validate(loginSchema),    login);
router.post('/firebase',                                  firebaseAuth);
router.get('/me',               protect,                  getMe);
router.put('/change-password',  protect,                  changePassword);

module.exports = router;
