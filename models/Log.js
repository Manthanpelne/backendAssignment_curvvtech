const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  event: {
    type: String,
    required: [true, 'Event type is required'],
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
logSchema.index({ device_id: 1, timestamp: -1 });
logSchema.index({ event: 1, timestamp: -1 });

// Transform output
logSchema.methods.toJSON = function() {
  const log = this.toObject();
  log.id = log._id;
  delete log._id;
  delete log.__v;
  delete log.createdAt;
  delete log.updatedAt;
  return log;
};

module.exports = mongoose.model('Log', logSchema);