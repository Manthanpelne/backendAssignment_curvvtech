const Joi = require('joi');

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateDevice = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    type: Joi.string().valid('light', 'thermostat', 'camera', 'sensor', 'smart_meter', 'switch', 'other').required(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').default('active'),
    metadata: Joi.object().default({})
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateDeviceUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100),
    type: Joi.string().valid('light', 'thermostat', 'camera', 'sensor', 'smart_meter', 'switch', 'other'),
    status: Joi.string().valid('active', 'inactive', 'maintenance'),
    metadata: Joi.object()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateLog = (req, res, next) => {
  const schema = Joi.object({
    event: Joi.string().required(),
    value: Joi.required(),
    metadata: Joi.object().default({})
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validateHeartbeat = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('active', 'inactive', 'maintenance').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateDevice,
  validateDeviceUpdate,
  validateLog,
  validateHeartbeat
};