// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// Pattern: RESTful API, JWT Auth, Socket.io, Zustand
// Style: ES6+, async/await, functional React with hooks
// File: Task controller with scoped access, CRUD, comments, and attachments

const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const buildAccessFilter = (userId) => ({
  $or: [{ createdBy: userId }, { assignedTo: userId }],
});

const hasTaskAccess = (task, userId) =>
  task.createdBy.toString() === userId.toString() ||
  (task.assignedTo && task.assignedTo.toString() === userId.toString());

const parsePagination = (page = 1, limit = 20) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

const logActivity = async (data) => {
  try {
    await ActivityLog.logActivity(data);
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate, tags } =
      req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : [],
    });

    await task.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    await logActivity({
      action: 'task_created',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { title, priority, status },
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating task',
      data: null,
    });
  }
};

// @desc    Get all tasks with filters and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const clauses = [buildAccessFilter(req.user._id)];

    if (status && status !== 'all') {
      clauses.push({ status });
    }

    if (priority && priority !== 'all') {
      clauses.push({ priority });
    }

    if (assignedTo) {
      clauses.push({ assignedTo });
    }

    if (search) {
      clauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const filter = clauses.length > 1 ? { $and: clauses } : clauses[0];
    const pagination = parsePagination(page, limit);

    const [total, tasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          total,
          page: pagination.page,
          pages: Math.ceil(total / pagination.limit),
          limit: pagination.limit,
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving tasks',
      data: null,
    });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving task',
      data: null,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
        data: null,
      });
    }

    const oldValues = {
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
    };

    const { title, description, status, priority, assignedTo, dueDate, tags } =
      req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : task.tags;

    await task.save();

    await task.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    if (status !== undefined && status !== oldValues.status) {
      await logActivity({
        action: 'task_status_changed',
        entityType: 'task',
        entityId: task._id,
        entityTitle: task.title,
        user: req.user._id,
        oldValue: oldValues.status,
        newValue: status,
      });
    } else if (
      assignedTo !== undefined &&
      String(assignedTo || '') !== String(oldValues.assignedTo || '')
    ) {
      await logActivity({
        action: assignedTo ? 'task_assigned' : 'task_unassigned',
        entityType: 'task',
        entityId: task._id,
        entityTitle: task.title,
        user: req.user._id,
        oldValue: oldValues.assignedTo,
        newValue: assignedTo || null,
      });
    } else {
      await logActivity({
        action: 'task_updated',
        entityType: 'task',
        entityId: task._id,
        entityTitle: task.title,
        user: req.user._id,
        details: { title, priority, status },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task',
      data: null,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
        data: null,
      });
    }

    const taskTitle = task.title;
    await Task.findByIdAndDelete(req.params.id);

    await logActivity({
      action: 'task_deleted',
      entityType: 'task',
      entityId: req.params.id,
      entityTitle: taskTitle,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { taskId: req.params.id },
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      data: null,
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const accessFilter = buildAccessFilter(req.user._id);

    const [statusStats, priorityStats, overdueTasks, totalTasks] = await Promise.all([
      Task.aggregate([
        { $match: accessFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: accessFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.countDocuments({
        ...accessFilter,
        dueDate: { $lt: new Date() },
        status: { $ne: 'done' },
      }),
      Task.countDocuments(accessFilter),
    ]);

    const stats = {
      total: totalTasks,
      byStatus: {
        todo: 0,
        'in-progress': 0,
        done: 0,
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
      },
      overdue: overdueTasks,
    };

    statusStats.forEach((item) => {
      stats.byStatus[item._id] = item.count;
    });

    priorityStats.forEach((item) => {
      stats.byPriority[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: { stats },
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics',
      data: null,
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text, mentions } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this task',
        data: null,
      });
    }

    task.comments.push({
      text,
      user: req.user._id,
      mentions: Array.isArray(mentions) ? mentions : [],
    });
    await task.save();

    await task.populate([
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'comments.mentions', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    await logActivity({
      action: 'comment_added',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { commentText: text?.substring(0, 100) || '' },
    });

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding comment',
      data: null,
    });
  }
};

// @desc    Delete comment from task
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
        data: null,
      });
    }

    const comment = task.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        data: null,
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
        data: null,
      });
    }

    task.comments.pull(commentId);
    await task.save();

    await task.populate([
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    await logActivity({
      action: 'comment_deleted',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting comment',
      data: null,
    });
  }
};

// @desc    Add attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const addAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload files to this task',
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        data: null,
      });
    }

    task.attachments.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    await task.save();

    await task.populate([
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    await logActivity({
      action: 'file_uploaded',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { filename: req.file.originalname },
    });

    return res.status(201).json({
      success: true,
      message: 'Attachment added successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Add attachment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding attachment',
      data: null,
    });
  }
};

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
const deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    if (!hasTaskAccess(task, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
        data: null,
      });
    }

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found',
        data: null,
      });
    }

    if (
      attachment.uploadedBy.toString() !== req.user._id.toString() &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this attachment',
        data: null,
      });
    }

    const filename = attachment.originalName;
    task.attachments.pull(attachmentId);
    await task.save();

    await task.populate([
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    await logActivity({
      action: 'file_deleted',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { filename },
    });

    return res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Delete attachment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting attachment',
      data: null,
    });
  }
};

module.exports = {
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
};
