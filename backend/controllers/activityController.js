// Project: TeamSync - Real-time Task Management
// File: Activity controller for activity feed

const ActivityLog = require('../models/ActivityLog');

// @desc    Get recent activity feed
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await ActivityLog.countDocuments();
    const activities = await ActivityLog.getRecentActivities(parseInt(limit), skip);

    res.status(200).json({
      success: true,
      message: 'Activities retrieved successfully',
      data: {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving activities',
      data: null,
    });
  }
};

// @desc    Get activities for a specific task
// @route   GET /api/activities/task/:taskId
// @access  Private
const getTaskActivities = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.getEntityActivities('task', taskId, parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Task activities retrieved successfully',
      data: { activities },
    });
  } catch (error) {
    console.error('Get task activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving task activities',
      data: null,
    });
  }
};

// Helper function to create activity logs (used by other controllers)
const createActivityLog = async (data) => {
  try {
    return await ActivityLog.logActivity(data);
  } catch (error) {
    console.error('Error creating activity log:', error);
    return null;
  }
};

module.exports = {
  getActivities,
  getTaskActivities,
  createActivityLog,
};
