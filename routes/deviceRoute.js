const express = require('express');
const {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  recordHeartbeat,
  createLog,
  getDeviceLogs,
  getDeviceUsage
} = require('../controllers/deviceController');
const protect = require('../middlewares/authMiddleware');

const {
  validateDevice,
  validateDeviceUpdate,
  validateLog,
  validateHeartbeat
} = require('../middlewares/validation');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Device management routes
router.post('/', validateDevice, createDevice);
router.get('/', getDevices);
router.patch('/:id', validateDeviceUpdate, updateDevice);
router.delete('/:id', deleteDevice);

// Device heartbeat
router.post('/:id/heartbeat', validateHeartbeat, recordHeartbeat);

// Device logging and analytics
router.post('/:id/logs', validateLog, createLog);
router.get('/:id/logs', getDeviceLogs);
router.get('/:id/usage', getDeviceUsage);

module.exports = router;