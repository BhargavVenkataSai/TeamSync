// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Task routes with comments and attachments

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// All routes are protected
router.use(protect);

// Task statistics (must be before /:id route)
router.get('/stats', getTaskStats);

// CRUD operations
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

// Comments routes
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

// Attachments routes
router.post('/:id/attachments', upload.single('file'), handleUploadError, addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;
