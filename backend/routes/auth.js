// Authentication Routes
// Defines endpoints for user authentication

const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * POST /api/auth/signup
 * Create a new user account
 * Body: { name, email, password }
 * Returns: { user, token }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * Authenticate existing user
 * Body: { email, password }
 * Returns: { user, token }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current authenticated user data
 * Headers: Authorization: Bearer <token>
 * Returns: { user }
 */
router.get('/me', authMiddleware, getMe);

module.exports = router;
