// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: User routes for profile management

const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Profile management
router.put('/profile', updateProfile);
router.put('/password', changePassword);

// Get user by ID
router.get('/:id', getUserById);

module.exports = router;
