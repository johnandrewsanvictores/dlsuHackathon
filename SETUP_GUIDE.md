# Work Hive - AI-Powered Job Aggregator Setup Guide

## Overview

Work Hive is an intelligent job listing platform that:
- 🔍 **Aggregates jobs** from multiple platforms (OnlineJobs.ph, Indeed, JobStreet)
- 🤖 **AI-powered matching** based on resume analysis
- 📊 **Application tracking** with comprehensive dashboard
- 📅 **Interview scheduling** and calendar management
- 🎯 **Personalized recommendations** using resume skill extraction

## Features Implemented

### ✅ Backend Features
- **Multi-platform job scraping** (OnlineJobs.ph, Indeed, JobStreet)
- **Resume upload and AI analysis** using Pollinations API
- **Job matching algorithm** with Fuse.js fuzzy matching
- **Complete CRUD operations** for job applications
- **User authentication** with Google OAuth and local auth
- **RESTful APIs** for all functionality
- **MongoDB database** with proper schemas

### ✅ Frontend Features
- **Modern React UI** with Tailwind CSS
- **Job listings page** with AI filtering and search
- **Resume upload** with progress tracking
- **Application tracking** (My Jobs page)
- **Interactive dashboard** with statistics
- **Calendar view** for interview management
- **User profile** management
- **Responsive design** for all screen sizes

## Quick Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### 1. Environment Setup

Create `.env` file in the `server` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/workhive
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workhive

# Server
PORT=3000
NODE_ENV=development

# Session & Authentication
SESSION_SECRET=your-super-secret-session-key-here
FRONTEND_BASE_URL=http://localhost:5173
COOKIE_DOMAIN=localhost

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:3000
```

### 2. Installation & Run

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Set up sample data (from server directory)
cd ../server
npm run setup

# Start development servers
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Core Functionality

### 1. User Onboarding
- Upload resume (PDF/DOC/DOCX)
- AI extracts skills automatically
- Skills used for job matching

### 2. Job Discovery
- Browse aggregated jobs from multiple platforms
- Toggle AI filtering for personalized matches
- Search and filter by work type, employment type
- View match percentages based on resume

### 3. Application Management
- Apply and track jobs
- Update application status
- Schedule interviews
- Add notes and manage timeline

### 4. Dashboard Analytics
- View application statistics
- Track recent activity
- Monitor upcoming interviews
- Application status breakdown

## API Endpoints

### Jobs
- `GET /jobs` - Get all jobs with filtering
- `GET /jobs/ai-filtered` - Get AI-matched jobs
- `POST /jobs/scrape` - Trigger job scraping
- `GET /jobs/my` - Get user's applications
- `POST /jobs` - Create job application
- `PUT /jobs/:id` - Update job application
- `DELETE /jobs/:id` - Delete job application

### Resume
- `POST /resume/upload` - Upload and analyze resume
- `POST /resume/filter-jobs` - Filter jobs by resume

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

### Authentication
- `POST /auth/signin` - Local login
- `GET /auth/google` - Google OAuth
- `POST /auth/logout` - Logout

## Database Schema

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String (hashed),
  googleId: String,
  resumeContext: String (AI-extracted text)
}
```

### Job Info
```javascript
{
  jobTitle: String,
  companyName: String,
  location: String,
  workArrangement: Enum,
  employmentType: Enum,
  postedDate: Date,
  shortDescription: String,
  applicationLink: String
}
```

### My Jobs (User Applications)
```javascript
{
  userID: ObjectId,
  jobInFold: ObjectId,
  status: Enum,
  interviewDate: Date,
  applicationDate: Date,
  notes: String
}
```

## Testing the Features

### 1. Test Resume Upload
1. Go to `/onboarding`
2. Upload a PDF resume
3. Watch AI analysis progress
4. Navigate to jobs page

### 2. Test AI Job Matching
1. Ensure resume is uploaded
2. Go to `/jobs`
3. Toggle "Show only AI-matched jobs"
4. See personalized matches with percentages

### 3. Test Job Scraping
1. Go to `/jobs`
2. Click "Update Jobs" button
3. Watch new jobs appear (simulated for demo)

### 4. Test Application Tracking
1. Apply to jobs from jobs page
2. Go to `/my-jobs`
3. Edit application status
4. Add interview dates

### 5. Test Dashboard
1. Apply to several jobs
2. Go to `/dashboard`
3. View statistics and recent activity

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check connection string in `.env`

2. **CORS Issues**
   - Verify FRONTEND_BASE_URL in server `.env`
   - Check VITE_API_URL in client `.env`

3. **Resume Upload Fails**
   - Check file size (max 10MB)
   - Ensure file is PDF/DOC/DOCX
   - Verify multer middleware setup

4. **Jobs Not Loading**
   - Run sample data setup: `npm run setup`
   - Check MongoDB connection
   - Verify API endpoints

## Future Enhancements

- Real-time job scraping with cron jobs
- Email notifications for new matches
- Advanced AI resume parsing
- Integration with more job platforms
- Mobile app development
- Video interview integration

## Development Notes

- Uses modern ES6+ JavaScript with modules
- Implements async/await throughout
- Follows RESTful API conventions
- Uses JWT for authentication
- Implements proper error handling
- Responsive design with Tailwind CSS
- Component-based React architecture

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review API responses in browser dev tools

The application is designed to be fully functional with AI-powered job matching, making it a comprehensive solution for modern job seekers.
