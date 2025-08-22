const Device = require('../models/Device');

// Auto-deactivate devices that haven't been active for more than 24 hours
const deactivateInactiveDevices = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const result = await Device.updateMany(
      {
        last_active_at: { $lt: twentyFourHoursAgo },
        status: { $ne: 'inactive' }
      },
      {
        status: 'inactive'
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Deactivated ${result.modifiedCount} inactive devices`);
    }
  } catch (error) {
    console.error('Error in deactivateInactiveDevices job:', error);
  }
};

module.exports = {
  deactivateInactiveDevices
};