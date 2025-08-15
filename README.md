# OnlineJobs.ph Web Scraper

A comprehensive web scraper built with Node.js and Puppeteer to extract job listings data from OnlineJobs.ph.

## Features

- **Job Data Extraction**: Extracts comprehensive job information including:

  - Job title and description
  - Company name and logo
  - Employment type (Full-time, Part-time, Gig, Any)
  - Salary/compensation information
  - Required skills and tags
  - Posting date
  - Job URL
  - Company logo URL

- **Advanced Search**: Search jobs by keywords, skills, and employment types
- **Multi-page Scraping**: Scrape multiple pages automatically
- **Data Export**: Save data in JSON and CSV formats
- **Statistics**: Generate insights about scraped data
- **Respectful Scraping**: Built-in delays and user-agent spoofing

## Installation

1. **Clone or download the project files**
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

### Basic Usage

```bash
# Run the scraper (default: scrapes 3 pages)
npm start

# Or directly with node
node scraper-onlinejobs.js
```

### Programmatic Usage

```javascript
const OnlineJobsScraper = require("./scraper-onlinejobs.js");

async function main() {
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Scrape current page
    await scraper.scrapeJobs();

    // Scrape multiple pages
    await scraper.scrapeMultiplePages(5);

    // Search with specific criteria
    await scraper.searchJobs(
      "developer",
      ["JavaScript", "React"],
      ["full-time"]
    );

    // Save data
    await scraper.saveToFile("jobs.json");
    await scraper.saveToCSV("jobs.csv");

    // Get statistics
    const stats = scraper.getStats();
    console.log(stats);
  } finally {
    await scraper.close();
  }
}

main();
```

### Search Examples

```javascript
// Search for developer jobs with specific skills
await scraper.searchJobs(
  "developer",
  ["JavaScript", "React", "Node.js"],
  ["full-time"]
);

// Search for marketing jobs
await scraper.searchJobs(
  "marketing",
  ["SEO", "Social Media"],
  ["part-time", "full-time"]
);

// Search for any remote jobs
await scraper.searchJobs("", [], ["gig", "part-time"]);
```

## Data Structure

Each job listing contains:

```json
{
  "title": "Video Editor for Sports Hype/highlight Instagram reel/ YouTube short",
  "employmentType": "Gig",
  "companyName": "Sal Castagnaro",
  "postingDate": "Aug 15, 2025",
  "salary": "25/gig",
  "description": "I need a video editor to edit video footage...",
  "skills": ["After Effects", "Adobe Premiere Pro", "Color Grading"],
  "jobUrl": "https://www.onlinejobs.ph/jobseekers/job/...",
  "companyLogo": "https://media.onlinejobs.ph/employer_logos/...",
  "scrapedAt": "2025-01-15T10:30:00.000Z"
}
```

## Output Files

### JSON Output (`onlinejobs_data.json`)

```json
{
  "totalJobs": 90,
  "scrapedAt": "2025-01-15T10:30:00.000Z",
  "jobs": [...]
}
```

### CSV Output (`onlinejobs_data.csv`)

Comma-separated values with headers for easy import into Excel, Google Sheets, or databases.

## Statistics

The scraper provides comprehensive statistics:

- Total jobs scraped
- Employment type distribution
- Top skills frequency
- Company posting frequency
- Recent postings count
- Salary range distribution

## Configuration

### Browser Settings

```javascript
// In the initialize() method, you can modify:
this.browser = await puppeteer.launch({
  headless: false, // Set to true for production
  defaultViewport: null, // Full browser window
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
```

### Scraping Delays

```javascript
// Modify delay between pages (default: 2000ms)
await this.delay(2000);
```

## Ethical Considerations

- **Rate Limiting**: Built-in delays between page requests
- **User Agent**: Spoofs legitimate browser user agent
- **Respectful**: Doesn't overwhelm the server
- **Terms of Service**: Please review OnlineJobs.ph terms before scraping

## Troubleshooting

### Common Issues

1. **"Error: Protocol error"**

   - Try setting `headless: false` to see what's happening
   - Check if the website structure has changed

2. **"Timeout waiting for selector"**

   - The website might be slow or the selector has changed
   - Increase timeout value in `waitForSelector`

3. **"Navigation timeout"**
   - Check your internet connection
   - The website might be down or slow

### Debug Mode

```javascript
// Enable debug logging
const scraper = new OnlineJobsScraper();
await scraper.initialize();

// Set headless to false to see the browser
// Add console.log statements in the code
```

## Legal Notice

This scraper is for educational and research purposes. Please:

1. Review OnlineJobs.ph's Terms of Service
2. Respect robots.txt if present
3. Don't overload their servers
4. Consider reaching out for API access if available

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the scraper.

## License

MIT License - feel free to use and modify as needed.

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify the website structure hasn't changed
3. Update Puppeteer to the latest version
4. Check Node.js version compatibility

---

**Happy Scraping! 🚀**
