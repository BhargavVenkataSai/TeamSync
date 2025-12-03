// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Task controller with CRUD operations, comments, and file attachments

const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// Helper function to log activities
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
      tags: tags || [],
    });

    // Populate user fields
    await task.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    // Log activity
    await logActivity({
      action: 'task_created',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { title, priority, status },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
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
    const { status, priority, assignedTo, search, page = 1, limit = 20 } = req.query;

    // Build filter object
    const filter = {};

    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Filter by assigned user
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await Task.countDocuments(filter);

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
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
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        data: null,
      });
    }

    // Store old values for activity logging
    const oldValues = {
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
    };

    // Update task
    const { title, description, status, priority, assignedTo, dueDate, tags } =
      req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        priority: priority || task.priority,
        assignedTo: assignedTo !== undefined ? assignedTo : task.assignedTo,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate,
        tags: tags || task.tags,
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar');

    // Log activity based on what changed
    if (status && status !== oldValues.status) {
      await logActivity({
        action: 'task_status_changed',
        entityType: 'task',
        entityId: task._id,
        entityTitle: task.title,
        user: req.user._id,
        oldValue: oldValues.status,
        newValue: status,
      });
    } else if (assignedTo !== undefined && String(assignedTo) !== String(oldValues.assignedTo)) {
      await logActivity({
        action: assignedTo ? 'task_assigned' : 'task_unassigned',
        entityType: 'task',
        entityId: task._id,
        entityTitle: task.title,
        user: req.user._id,
        oldValue: oldValues.assignedTo,
        newValue: assignedTo,
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

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
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

    // Check if user is the creator
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
        data: null,
      });
    }

    const taskTitle = task.title;
    await Task.findByIdAndDelete(req.params.id);

    // Log activity
    await logActivity({
      action: 'task_deleted',
      entityType: 'task',
      entityId: req.params.id,
      entityTitle: taskTitle,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { taskId: req.params.id },
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
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
    // Aggregate tasks by status
    const statusStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate tasks by priority
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Count overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    });

    // Total tasks
    const totalTasks = await Task.countDocuments();

    // Format stats
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

    statusStats.forEach((s) => {
      stats.byStatus[s._id] = s.count;
    });

    priorityStats.forEach((p) => {
      stats.byPriority[p._id] = p.count;
    });

    res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: { stats },
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics',
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

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
async function addComment(req, res) {
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

    const comment = {
      text,
      user: req.user._id,
      mentions: mentions || [],
    };

    task.comments.push(comment);
    await task.save();

    // Populate the comments
    await task.populate([
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'comments.mentions', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    // Log activity
    await logActivity({
      action: 'comment_added',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { commentText: text.substring(0, 100) },
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding comment',
      data: null,
    });
  }
}

// @desc    Delete comment from task
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
async function deleteComment(req, res) {
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

    const comment = task.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        data: null,
      });
    }

    // Only comment author or task creator can delete
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

    // Populate
    await task.populate([
      { path: 'comments.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    // Log activity
    await logActivity({
      action: 'comment_deleted',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting comment',
      data: null,
    });
  }
}

// @desc    Add attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
async function addAttachment(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
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

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    };

    task.attachments.push(attachment);
    await task.save();

    // Populate
    await task.populate([
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    // Log activity
    await logActivity({
      action: 'file_uploaded',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { filename: req.file.originalname },
    });

    res.status(201).json({
      success: true,
      message: 'Attachment added successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Add attachment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding attachment',
      data: null,
    });
  }
}

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
async function deleteAttachment(req, res) {
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

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found',
        data: null,
      });
    }

    // Only uploader or task creator can delete
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

    // Populate
    await task.populate([
      { path: 'attachments.uploadedBy', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignedTo', select: 'name email avatar' },
    ]);

    // Log activity
    await logActivity({
      action: 'file_deleted',
      entityType: 'task',
      entityId: task._id,
      entityTitle: task.title,
      user: req.user._id,
      details: { filename },
    });

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting attachment',
      data: null,
    });
  }
}
