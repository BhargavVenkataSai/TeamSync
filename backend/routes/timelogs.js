// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Time log routes for querying and managing time entries

const express = require('express');
const router = express.Router();
const {
  getTimeLogs,
  getTimeLogSummary,
  deleteTimeLog,
} = require('../controllers/timelogController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Summary route (must be before /:id to avoid conflicts)
router.get('/summary', getTimeLogSummary);

// CRUD operations
router.get('/', getTimeLogs);
router.delete('/:id', deleteTimeLog);

module.exports = router;
