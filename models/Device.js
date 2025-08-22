const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    maxlength: [100, 'Device name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Device type is required'],
    enum: ['light', 'thermostat', 'camera', 'sensor', 'smart_meter', 'switch', 'other'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  last_active_at: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
deviceSchema.index({ owner_id: 1, type: 1, status: 1 });
deviceSchema.index({ last_active_at: 1 });

// Transform output
deviceSchema.methods.toJSON = function() {
  const device = this.toObject();
  device.id = device._id;
  delete device._id;
  delete device.__v;
  return device;
};

module.exports = mongoose.model('Device', deviceSchema);