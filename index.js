const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();
const connection = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const deviceRoutes = require('./routes/deviceRoute');
const { deactivateInactiveDevices } = require('./jobs/deviceJobs');



const app = express()

// Security middleware
app.use(helmet());
app.use(cors());

// Global rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);



// Background job: Run every hour to deactivate inactive devices
cron.schedule('0 * * * *', () => {
  console.log('Running device deactivation job...');
  deactivateInactiveDevices();
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, async() => {
    await connection()
  console.log(`Server running on port ${PORT}`);
});