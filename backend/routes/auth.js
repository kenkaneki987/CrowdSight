const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// User registration
router.post('/signup', register);

// User login
router.post('/login', login);

// Get current user info (protected route)
router.get('/me', authMiddleware, getMe);

module.exports = router;
