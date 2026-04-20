const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

timeLogSchema.index({ taskId: 1 });
timeLogSchema.index({ userId: 1 });

module.exports = mongoose.model('TimeLog', timeLogSchema);
