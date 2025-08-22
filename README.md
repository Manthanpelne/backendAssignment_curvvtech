# Smart Device Management Platform - Backend API

A comprehensive Node.js backend system for managing IoT devices with user authentication, device management, logging, and analytics.

## Features

- **User Management**: Registration, authentication with JWT
- **Device Management**: CRUD operations for IoT devices
- **Real-time Tracking**: Device heartbeat and status monitoring
- **Data Logging**: Event logging and analytics
- **Security**: Rate limiting, input validation, secure authentication
- **Background Jobs**: Autoeactivation of inactive devices

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Rate Limiting** for API protection
- **Cron Jobs** for background tasks

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=8000
MONGODB_URI= url mongodb url
JWT_SECRET=your secret key
JWT_EXPIRE=7d
```

3. Start the server:
```bash
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Device Management
- `POST /api/devices` - Register new device
- `GET /api/devices` - List devices (with filters)
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/:id/heartbeat` - Record device heartbeat

### Data & Analytics
- `POST /api/devices/:id/logs` - Create log entry
- `GET /api/devices/:id/logs` - Get device logs
- `GET /api/devices/:id/usage` - Get device usage analytics



## Features Implemented

- ✅ User registration and authentication
- ✅ JWT-based authorization
- ✅ Device CRUD operations
- ✅ Device heartbeat tracking
- ✅ Event logging system
- ✅ Usage analytics with time ranges
- ✅ Rate limiting (100 requests/minute)
- ✅ Background job for device deactivation
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ MongoDB indexing for performance
- ✅ Pagination support
- ✅ Query filtering and sorting

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting protection
- Input validation with Joi
- Helmet.js security headers
- CORS configuration
- Role-based access control

## Background Jobs

The system runs a cron job every hour to automatically deactivate devices that haven't sent a heartbeat in the last 24 hours.

## Database Schema

### Users
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: user/admin
- `isActive`: Account status

### Devices
- `name`: Device name
- `type`: Device type (light, thermostat, etc.)
- `status`: active/inactive/maintenance
- `owner_id`: Reference to user
- `last_active_at`: Last heartbeat timestamp
- `metadata`: Additional device data

### Logs
- `device_id`: Reference to device
- `event`: Event type
- `value`: Event value/data
- `timestamp`: Event timestamp
- `metadata`: Additional event data

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

