const express = require('express');
const { register, login,logout, getUserRole } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (student or instructor)
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, logout);

// @route   GET /api/auth/role
// @desc    Get the user's role
// @access  Private
router.get('/role', authenticate, getUserRole);

module.exports = router;
