# Contest Tracker

A full-stack application to track programming contests from Codeforces, CodeChef, and LeetCode.

## Features

- Real-time contest tracking
- Platform-specific filtering
- Contest bookmarking
- Automatic YouTube solution integration
- Dark/Light theme
- Responsive design

## Tech Stack

- Frontend: React, TypeScript, Styled Components
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Authentication: JWT

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Start the development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   # Frontend
   cd frontend && npm start
   ```

## API Documentation

### Endpoints

- `GET /api/contests` - Get all contests
- `POST /api/contests/:id/bookmark` - Bookmark a contest
- `POST /api/sync-solutions` - Sync YouTube solutions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
