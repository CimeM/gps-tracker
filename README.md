# TracSync API

A comprehensive Node.js backend API for the TracSync GPS route tracking application, built with Express.js, MongoDB, and Firebase Authentication.

## Features

- **Firebase Authentication**: Secure authentication using Firebase Admin SDK
- **Route Management**: Upload, store, and manage GPX route files
- **Tracker Integration**: Support for hardware GPS trackers (Pocket Tracker)
- **File Storage**: Secure GPX file upload and storage
- **Analytics**: Route statistics and user analytics
- **Rate Limiting**: API rate limiting for security
- **Comprehensive Validation**: Input validation and sanitization

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud instance)
- Firebase project with Admin SDK credentials

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/tracsync
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Deactivate account
- `POST /api/auth/upgrade` - Upgrade user plan
- `GET /api/auth/stats` - Get user statistics
- `POST /api/auth/verify` - Verify Firebase token

### Routes
- `POST /api/routes/upload` - Upload GPX file
- `GET /api/routes/user` - Get user's routes
- `GET /api/routes/public` - Get public routes
- `GET /api/routes/:id` - Get single route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route
- `POST /api/routes/:id/like` - Like route
- `DELETE /api/routes/:id/like` - Unlike route

### Trackers
- `POST /api/trackers` - Add new tracker
- `GET /api/trackers` - Get user's trackers
- `GET /api/trackers/:id` - Get single tracker
- `PUT /api/trackers/:id/settings` - Update tracker settings
- `DELETE /api/trackers/:id` - Delete tracker
- `POST /api/trackers/:id/sync` - Sync tracker
- `POST /api/trackers/:code/location` - Update tracker location

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

## Database Schema

### User Model
```javascript
{
  firebaseUid: String,
  email: String,
  displayName: String,
  photoURL: String,
  plan: ['free', 'pro', 'enterprise'],
  storageUsed: Number,
  storageLimit: Number,
  preferences: Object,
  isEmailVerified: Boolean,
  // ... timestamps and other fields
}
```

### Route Model
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  activityType: String,
  segments: [RouteSegment],
  totalDistance: Number,
  totalDuration: Number,
  totalElevationGain: Number,
  startPoint: Coordinate,
  endPoint: Coordinate,
  bounds: Object,
  gpxFile: Object,
  isPublic: Boolean,
  // ... timestamps and other fields
}
```

### Tracker Model
```javascript
{
  userId: ObjectId,
  code: String,
  label: String,
  settings: {
    updateInterval: Number,
    powerSaveMode: Boolean,
    geofenceRadius: Number,
    // ... other settings
  },
  status: {
    isOnline: Boolean,
    batteryLevel: Number,
    signalStrength: Number,
    lastLocation: Coordinate,
    lastSync: Date
  },
  // ... timestamps and other fields
}
```

## Security Features

- **Firebase Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **File Upload Security**: Secure file handling with size limits

## File Storage

GPX files are stored locally in the `uploads/gpx` directory. Each file is:
- Renamed with user ID and timestamp for uniqueness
- Validated for GPX format
- Size-limited based on user plan
- Tracked for storage quota management

## Error Handling

The API includes comprehensive error handling:
- Structured error responses
- Validation error details
- Proper HTTP status codes
- Development vs production error details
- Centralized error middleware

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `NODE_ENV=production`
- `MONGODB_URI` (production database)
- `FIREBASE_*` (Firebase Admin SDK credentials)
- `FRONTEND_URL` (production frontend URL)

### Process Management
Use PM2 or similar for production process management:
```bash
npm install -g pm2
pm2 start src/server.js --name "tracsync-api"
```

## API Documentation

For detailed API documentation, visit `/api/docs` when the server is running (if Swagger is configured) or refer to the route files in `src/routes/`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.