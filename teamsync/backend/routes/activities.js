// Project: TeamSync - Real-time Task Management
// File: Activity routes

const express = require('express');
const router = express.Router();
const { getActivities, getTaskActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get activity feed
router.get('/', getActivities);

// Get activities for a specific task
router.get('/task/:taskId', getTaskActivities);

module.exports = router;
