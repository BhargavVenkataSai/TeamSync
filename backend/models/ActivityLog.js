// Project: TeamSync - Real-time Task Management
// File: ActivityLog model for tracking all changes

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'task_created',
        'task_updated',
        'task_deleted',
        'task_status_changed',
        'task_assigned',
        'task_unassigned',
        'comment_added',
        'comment_deleted',
        'file_uploaded',
        'file_deleted',
        'user_joined',
        'user_left',
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['task', 'comment', 'file', 'user'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    entityTitle: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // For tracking changes
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });

// Static method to create activity log entry
activityLogSchema.statics.logActivity = async function (data) {
  try {
    const activity = await this.create(data);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

// Static method to get recent activities
activityLogSchema.statics.getRecentActivities = async function (limit = 50, skip = 0) {
  return this.find()
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get activities for a specific entity
activityLogSchema.statics.getEntityActivities = async function (entityType, entityId, limit = 20) {
  return this.find({ entityType, entityId })
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
