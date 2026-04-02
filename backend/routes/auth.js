// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Authentication routes

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  getUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/users', protect, getUsers);

module.exports = router;
