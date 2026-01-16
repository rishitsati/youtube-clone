# YouTube Clone - Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory using `.env.example` as a template:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/youtube-clone
JWT_SECRET=your-super-secret-key-here
PORT=8000
```

### 3. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run start
```

The server will run on `http://localhost:8000`

---

## Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── videoController.js
│   ├── channelController.js
│   ├── commentController.js
│   └── playlistController.js
├── models/              # Database schemas
│   ├── User.js
│   ├── Video.js
│   ├── Channel.js
│   ├── Comment.js
│   ├── Playlist.js
│   ├── WatchHistory.js
│   └── Notification.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── videoRoutes.js
│   ├── channelRoutes.js
│   ├── commentRoutes.js
│   └── playlistRoutes.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── validation.js
│   └── errorHandler.js
├── server.js           # Express app setup
├── .env                # Environment variables
└── package.json        # Dependencies
```

---

## API Routes Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)
- `DELETE /api/auth/account` - Delete account (protected)

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Upload video (protected)
- `PUT /api/videos/:id` - Update video (protected, owner only)
- `DELETE /api/videos/:id` - Delete video (protected, owner only)
- `PUT /api/videos/:id/like` - Like video (protected)
- `PUT /api/videos/:id/unlike` - Unlike video (protected)
- `PUT /api/videos/:id/dislike` - Dislike video (protected)
- `PUT /api/videos/:id/undislike` - Remove dislike (protected)
- `POST /api/videos/:id/watch` - Track watch (protected)
- `GET /api/videos/watch-history` - Get watch history (protected)
- `GET /api/videos/suggest/:query` - Get search suggestions

### Channels
- `GET /api/channels/:id` - Get channel details
- `GET /api/channels/:id/videos` - Get channel videos
- `POST /api/channels` - Create channel (protected)
- `PUT /api/channels/:id` - Edit channel (protected, owner only)
- `POST /api/channels/:id/subscribe` - Subscribe (protected)
- `DELETE /api/channels/:id/subscribe` - Unsubscribe (protected)
- `GET /api/channels/:id/subscribers` - Get subscribers
- `GET /api/channels/:id/is-subscribed` - Check subscription (protected)
- `GET /api/channels/user/my-channels` - Get user's channels (protected)

### Comments
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments` - Add comment (protected)
- `PUT /api/comments/:id` - Edit comment (protected, author only)
- `DELETE /api/comments/:id` - Delete comment (protected, author only)
- `PUT /api/comments/:id/like` - Like comment (protected)
- `PUT /api/comments/:id/unlike` - Unlike comment (protected)

### Playlists
- `GET /api/playlists/user/my-playlists` - Get user's playlists (protected)
- `GET /api/playlists/:id` - Get playlist details (protected)
- `POST /api/playlists` - Create playlist (protected)
- `PUT /api/playlists/:id` - Edit playlist (protected, owner only)
- `DELETE /api/playlists/:id` - Delete playlist (protected, owner only)
- `POST /api/playlists/:id/videos` - Add video to playlist (protected)
- `DELETE /api/playlists/:id/videos` - Remove video from playlist (protected)

---

## Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  channels: [ObjectId],      // References to channels
  subscriptions: [ObjectId], // Subscribed channels
  likedVideos: [ObjectId],
  dislikedVideos: [ObjectId],
  watchHistory: [ObjectId],
  likedComments: [ObjectId],
  playlists: [ObjectId],
  timestamps: { createdAt, updatedAt }
}
```

### Video
```javascript
{
  title: String,
  description: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: Number,
  channel: ObjectId,         // Channel reference
  uploader: ObjectId,        // User reference
  views: Number,
  likedBy: [ObjectId],       // Users who liked
  dislikedBy: [ObjectId],    // Users who disliked
  likes: Number,             // Count for quick access
  dislikes: Number,
  category: String,
  tags: [String],
  timestamps: { createdAt, updatedAt }
}
```

### Channel
```javascript
{
  channelName: String,
  owner: ObjectId,           // User reference
  description: String,
  channelBanner: String,
  channelAvatar: String,
  subscribersList: [ObjectId], // Users subscribed
  subscribers: Number,       // Count for quick access
  videos: [ObjectId],
  timestamps: { createdAt, updatedAt }
}
```

### Comment
```javascript
{
  text: String,
  video: ObjectId,           // Video reference
  user: ObjectId,            // User reference
  parentComment: ObjectId,   // For nested replies
  replies: [ObjectId],       // Child comments
  likedBy: [ObjectId],
  likes: Number,
  engagement: Number,        // likes + replies count
  timestamps: { createdAt, updatedAt }
}
```

### Playlist
```javascript
{
  name: String,
  description: String,
  owner: ObjectId,           // User reference
  videos: [ObjectId],
  isPublic: Boolean,
  thumbnail: String,
  timestamps: { createdAt, updatedAt }
}
```

### WatchHistory
```javascript
{
  user: ObjectId,            // User reference
  video: ObjectId,           // Video reference
  secondsWatched: Number,
  totalDuration: Number,
  completed: Boolean,        // true if watched >= 90%
  timestamps: { createdAt, updatedAt }
}
```

---

## Authentication & Authorization

### JWT Token
- Tokens are issued on login and valid for 7 days
- Tokens must be sent in the Authorization header: `Bearer <token>`
- Token payload includes user ID and is used to identify the user

### Protected Routes
Routes marked with `(protected)` require a valid JWT token. If token is missing or invalid:
- Response: `401 Unauthorized`
- Message: "Not authorized, no token"

### Owner-Only Routes
Some routes can only be accessed by the resource owner:
- Edit/delete videos: Only the uploader
- Edit/delete channels: Only the owner
- Edit/delete comments: Only the author
- Edit/delete playlists: Only the creator

---

## Key Features Implemented

### User Management
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Profile updates
- ✅ Password change
- ✅ Account deletion

### Video System
- ✅ Upload videos (URL-based, file upload ready)
- ✅ Edit video metadata
- ✅ Delete videos
- ✅ Like/dislike with duplicate prevention
- ✅ View tracking
- ✅ Search suggestions
- ✅ Category filtering
- ✅ Watch history tracking

### Channel System
- ✅ Create channels
- ✅ Edit channel details
- ✅ Subscribe/Unsubscribe (with duplicate prevention)
- ✅ Get channel information
- ✅ Get channel videos
- ✅ Subscriber management

### Comments System
- ✅ Add comments
- ✅ Reply to comments (nested)
- ✅ Edit comments
- ✅ Delete comments
- ✅ Like comments (with duplicate prevention)
- ✅ Sort comments (newest/top)

### Playlists
- ✅ Create playlists
- ✅ Add/remove videos
- ✅ Edit playlist details
- ✅ Delete playlists
- ✅ Privacy control (public/private)

---

## Error Handling

All errors follow this format:
```json
{
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Future Enhancements

### File Upload
- [ ] Implement Multer for file uploads
- [ ] Support for video and image uploads
- [ ] File size validation
- [ ] Upload progress tracking

### Cloud Integration
- [ ] AWS S3 for video storage
- [ ] AWS CloudFront for CDN
- [ ] Image optimization

### Advanced Features
- [ ] Video recommendations (ML)
- [ ] Notifications system
- [ ] User search
- [ ] Trending algorithm
- [ ] Analytics dashboard

### Security
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] CSRF protection
- [ ] CORS refinement
- [ ] API key system for third-party integrations

### Testing
- [ ] Unit tests with Jest
- [ ] Integration tests
- [ ] API testing with Postman

---

## Troubleshooting

### MongoDB Connection Error
```
MongoDB Error: connect ECONNREFUSED
```
**Solution:** Check MONGO_URI in .env file and ensure MongoDB is running

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::8000
```
**Solution:** Change PORT in .env or kill the process using port 8000

### JWT Token Errors
```
Not authorized, token failed
```
**Solution:** Ensure token is valid and not expired. Re-login to get a new token

---

## Performance Tips

1. **Database Indexing:** Add indexes to frequently queried fields
2. **Pagination:** Implement pagination for large result sets
3. **Caching:** Use Redis for caching popular videos/channels
4. **Query Optimization:** Use `.lean()` for read-only queries
5. **Connection Pooling:** Adjust MongoDB connection pool size

---

## Testing with curl

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Videos
```bash
curl -X GET "http://localhost:8000/api/videos?category=All&sortBy=views"
```

### Like a Video (Protected)
```bash
curl -X PUT http://localhost:8000/api/videos/VIDEO_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support & Documentation

For more detailed API documentation, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

For frontend integration, see [Frontend README](../frontend/README.md)
