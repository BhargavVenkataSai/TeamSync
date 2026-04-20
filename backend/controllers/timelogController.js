// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Time log controller for querying and managing time entries

const TimeLog = require('../models/TimeLog');
const Task = require('../models/Task');

// @desc    Get time logs with filters (date range, taskId) and pagination
// @route   GET /api/timelogs
// @access  Private
const getTimeLogs = async (req, res) => {
  try {
    const {
      taskId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = { userId: req.user._id };

    if (taskId) {
      filter.taskId = taskId;
    }

    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [total, timeLogs] = await Promise.all([
      TimeLog.countDocuments(filter),
      TimeLog.find(filter)
        .populate('taskId', 'title status priority')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(safeLimit),
    ]);

    res.status(200).json({
      success: true,
      message: 'Time logs retrieved successfully',
      data: {
        timeLogs,
        pagination: {
          total,
          page: safePage,
          pages: Math.ceil(total / safeLimit),
          limit: safeLimit,
        },
      },
    });
  } catch (error) {
    console.error('Get time logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving time logs',
      data: null,
    });
  }
};

// @desc    Get aggregated time log summary (daily hours for the past 7 days)
// @route   GET /api/timelogs/summary
// @access  Private
const getTimeLogSummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const numDays = Math.min(Math.max(parseInt(days, 10) || 7, 1), 90);

    // Calculate the start of the period
    const now = new Date();
    const startOfPeriod = new Date(now);
    startOfPeriod.setDate(startOfPeriod.getDate() - (numDays - 1));
    startOfPeriod.setHours(0, 0, 0, 0);

    // Aggregate time logs by day
    const dailyLogs = await TimeLog.aggregate([
      {
        $match: {
          userId: req.user._id,
          startTime: { $gte: startOfPeriod },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' },
            day: { $dayOfMonth: '$startTime' },
          },
          totalMinutes: { $sum: '$durationMinutes' },
          sessions: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Get tasks completed per day
    const dailyCompletions = await Task.aggregate([
      {
        $match: {
          $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
          status: 'done',
          updatedAt: { $gte: startOfPeriod },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
            day: { $dayOfMonth: '$updatedAt' },
          },
          tasksCompleted: { $sum: 1 },
        },
      },
    ]);

    // Build a map of completions for easy lookup
    const completionMap = {};
    dailyCompletions.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
      completionMap[key] = item.tasksCompleted;
    });

    // Build a map of time logs for easy lookup
    const logMap = {};
    dailyLogs.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}-${item._id.day}`;
      logMap[key] = {
        totalMinutes: item.totalMinutes,
        sessions: item.sessions,
      };
    });

    // Generate output for each day in the period
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const summary = [];

    for (let i = 0; i < numDays; i++) {
      const date = new Date(startOfPeriod);
      date.setDate(date.getDate() + i);

      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const logEntry = logMap[key] || { totalMinutes: 0, sessions: 0 };
      const tasksCompleted = completionMap[key] || 0;

      summary.push({
        name: dayNames[date.getDay()],
        date: date.toISOString().split('T')[0],
        hours: parseFloat((logEntry.totalMinutes / 60).toFixed(1)),
        sessions: logEntry.sessions,
        tasksCompleted,
        // Productivity score: weighted combination of hours worked and tasks completed
        productivity: Math.min(
          100,
          Math.round(
            (logEntry.totalMinutes / 60) * 8 + tasksCompleted * 15
          )
        ),
      });
    }

    // Overall totals
    const totalMinutes = dailyLogs.reduce((sum, d) => sum + d.totalMinutes, 0);
    const totalSessions = dailyLogs.reduce((sum, d) => sum + d.sessions, 0);
    const totalTasksCompleted = dailyCompletions.reduce(
      (sum, d) => sum + d.tasksCompleted,
      0
    );

    res.status(200).json({
      success: true,
      message: 'Time log summary retrieved successfully',
      data: {
        summary,
        totals: {
          hours: parseFloat((totalMinutes / 60).toFixed(1)),
          sessions: totalSessions,
          tasksCompleted: totalTasksCompleted,
        },
      },
    });
  } catch (error) {
    console.error('Get time log summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving time log summary',
      data: null,
    });
  }
};

// @desc    Delete a time log entry
// @route   DELETE /api/timelogs/:id
// @access  Private
const deleteTimeLog = async (req, res) => {
  try {
    const timeLog = await TimeLog.findById(req.params.id);

    if (!timeLog) {
      return res.status(404).json({
        success: false,
        message: 'Time log not found',
        data: null,
      });
    }

    // Only the owner can delete their time logs
    if (timeLog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this time log',
        data: null,
      });
    }

    await TimeLog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Time log deleted successfully',
      data: { timeLogId: req.params.id },
    });
  } catch (error) {
    console.error('Delete time log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting time log',
      data: null,
    });
  }
};

module.exports = { getTimeLogs, getTimeLogSummary, deleteTimeLog };
