const Device = require('../models/Device');
const Log = require('../models/Log');
const mongoose = require('mongoose');

// @desc    Create new device
// @route   POST /devices

const createDevice = async (req, res) => {
  try {
    const { name, type, status, metadata } = req.body;

    const device = await Device.create({
      name,
      type,
      status: status || 'active',
      owner_id: req.user._id,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      device: device.toJSON()
    });

  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating device'
    });
  }
};

// @desc    Get all devices for user
// @route   GET /devices?type=light&status=active

const getDevices = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = { owner_id: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const devices = await Device.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Device.countDocuments(filter);

    res.json({
      success: true,
      devices: devices.map(device => device.toJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching devices'
    });
  }
};

// @desc    Update device
// @route   PATCH /devices/:id

const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update device
    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      device: updatedDevice.toJSON()
    });

  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating device'
    });
  }
};

// @desc    Delete device
// @route   DELETE /devices/:id

const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Delete device and its logs
    await Promise.all([
      Device.findByIdAndDelete(id),
      Log.deleteMany({ device_id: id })
    ]);

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });

  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting device'
    });
  }
};

// @desc    Record device heartbeat
// @route   POST /devices/:id/heartbeat

const recordHeartbeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update device status and last active time
    const now = new Date();
    device.status = status;
    device.last_active_at = now;
    await device.save();

    res.json({
      success: true,
      message: 'Device heartbeat recorded',
      last_active_at: now.toISOString()
    });

  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording heartbeat'
    });
  }
};

// @desc    Create log entry
// @route   POST /devices/:id/logs

const createLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { event, value, metadata } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const log = await Log.create({
      device_id: id,
      event,
      value,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      log: log.toJSON()
    });

  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating log entry'
    });
  }
};


// @desc    Get device logs
// @route   GET /devices/:id/logs?limit=10
const getDeviceLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const skip = (page - 1) * limit;
    const logs = await Log.find({ device_id: id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      logs: logs.map(log => log.toJSON())
    });

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs'
    });
  }
};

// @desc    Get device usage analytics
// @route   GET /devices/:id/usage?range=24h

const getDeviceUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = '24h' } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid device ID'
      });
    }

    const device = await Device.findOne({ _id: id, owner_id: req.user._id });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Calculate time range
    let startTime = new Date();
    switch (range) {
      case '1h':
        startTime.setHours(startTime.getHours() - 1);
        break;
      case '24h':
        startTime.setHours(startTime.getHours() - 24);
        break;
      case '7d':
        startTime.setDate(startTime.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(startTime.getDate() - 30);
        break;
      default:
        startTime.setHours(startTime.getHours() - 24);
    }

    // Aggregate usage data (example for units_consumed)
    const aggregation = await Log.aggregate([
      {
        $match: {
          device_id: new mongoose.Types.ObjectId(id),
          event: 'units_consumed',
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$value' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUnits = aggregation.length > 0 ? aggregation[0].totalUnits : 0;

    res.json({
      success: true,
      device_id: id,
      [`total_units_last_${range}`]: totalUnits,
      range,
      period: {
        from: startTime.toISOString(),
        to: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching usage data'
    });
  }
};

module.exports = {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  recordHeartbeat,
  createLog,
  getDeviceLogs,
  getDeviceUsage
};