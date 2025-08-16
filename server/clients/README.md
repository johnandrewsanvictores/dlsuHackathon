# Adzuna Job API Integration

This directory contains the Adzuna client for fetching job listings from the Adzuna API and integrating them with the existing job database.

## Files

- `adzunaClient.js` - Main client for interacting with Adzuna API
- `testAdzunaClient.js` - Test script to verify the client functionality
- `README.md` - This documentation file

## Setup

### Environment Variables

Add the following environment variables to your `.env` file:

```env
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key
```

### Testing the Client

Run the test script to verify the client works:

```bash
cd server/clients
node testAdzunaClient.js
```

## API Endpoints

### 1. Get Adzuna Jobs (Read-only)
```
GET /api/job-info/adzuna
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `what` (optional): Job search term (default: 'javascript developer')
- `where` (optional): Location (default: 'london')
- `resultsPerPage` (optional): Results per page (default: 20)

Example:
```
GET /api/job-info/adzuna?page=1&what=python%20developer&where=manchester&resultsPerPage=10
```

### 2. Fetch and Store Adzuna Jobs
```
POST /api/job-info/adzuna/fetch
```

**Requires Authentication**

Request Body:
```json
{
  "startPage": 1,
  "endPage": 5,
  "what": "javascript developer",
  "where": "london"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully processed 100 jobs from Adzuna",
  "data": {
    "savedJobs": 95,
    "skippedJobs": 5,
    "totalProcessed": 100,
    "savedJobDetails": [...],
    "skippedJobDetails": [...]
  }
}
```

## Data Normalization

The Adzuna client automatically normalizes job data to match the existing database schema:

### Work Arrangement Mapping
- `remote` → `remote`
- `hybrid` → `hybrid`
- `on-site`/`onsite` → `onSite`

### Employment Type Mapping
- `permanent` → `fullTime`
- `contract` → `contract`
- `part-time`/`parttime` → `partTime`
- `internship` → `internship`
- `freelance` → `selfEmployed`

### Experience Level Detection
Based on job title and description keywords:
- `senior`, `lead`, `principal` → `senior`
- `junior`, `graduate`, `entry` → `entry`
- `mid`, `intermediate` → `mid`

### Industry Detection
Based on job category:
- IT Jobs → `Technology`
- Finance/Banking → `Finance`
- Healthcare/Medical → `Healthcare`
- Education → `Education`
- Retail/Sales → `Retail`
- Marketing/Advertising → `Marketing`

## Database Integration

Jobs are stored in two collections:

1. **jobsInfo** - Main job information
2. **jobsMoreInfo** - Additional metadata including:
   - `sourceSite`: 'adzuna'
   - `originalJobId`: Adzuna's job ID
   - `sourceUrl`: Original job application URL

## Duplicate Prevention

The system prevents duplicate jobs by checking the `originalJobId` in the `jobsMoreInfo` collection before inserting new records.

## Error Handling

The client includes comprehensive error handling:
- API request failures
- Data validation errors
- Database insertion errors
- Rate limiting (1-second delay between requests)

## Usage Examples

### Fetch jobs from pages 1-5
```javascript
const response = await fetch('/api/job-info/adzuna/fetch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    startPage: 1,
    endPage: 5,
    what: 'python developer',
    where: 'manchester'
  })
});
```

### Get jobs without storing
```javascript
const response = await fetch('/api/job-info/adzuna?page=1&what=react%20developer&where=leeds');
const data = await response.json();
```
