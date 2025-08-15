module.exports = {
  // Browser configuration
  browser: {
    headless: false, // Set to true for production/headless mode
    defaultViewport: null, // Full browser window
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },

  // Scraping configuration
  scraping: {
    baseUrl: "https://www.onlinejobs.ph/jobseekers/jobsearch",
    maxPages: 5, // Maximum pages to scrape
    delayBetweenPages: 2000, // Delay between page requests (ms)
    timeout: 10000, // Timeout for waiting for selectors (ms)
    maxRetries: 3, // Maximum retries for failed requests
  },

  // Search configuration
  search: {
    maxSkills: 3, // Maximum skills to select (website limit)
    employmentTypes: {
      gig: "gig",
      "part-time": "Part-time",
      "full-time": "Full-time",
      any: "any",
    },
  },

  // Data extraction selectors
  selectors: {
    jobContainer: ".jobpost-cat-box",
    title: "h4",
    employmentType: ".badge",
    companyAndDate: "p[data-temp]",
    salary: "dd.col",
    description: ".desc",
    skills: ".job-tag .badge",
    companyLogo: ".jobpost-cat-box-logo",
    nextPage: 'a[rel="next"]',
    searchKeyword: "#jobkeyword",
    skillSearch: "#js-skill-search",
    refineButton: 'button[type="submit"]',
  },

  // Output configuration
  output: {
    defaultJsonFile: "onlinejobs_data.json",
    defaultCsvFile: "onlinejobs_data.csv",
    includeTimestamp: true,
    prettyPrint: true,
  },

  // Rate limiting and ethical scraping
  ethical: {
    respectRobotsTxt: true,
    maxRequestsPerMinute: 30,
    randomizeDelays: true,
    delayRange: {
      min: 1500,
      max: 3500,
    },
  },

  // Logging configuration
  logging: {
    level: "info", // 'debug', 'info', 'warn', 'error'
    showProgress: true,
    saveLogs: false,
    logFile: "scraper.log",
  },

  // Data filtering options
  filtering: {
    minSalary: null, // Minimum salary filter
    maxSalary: null, // Maximum salary filter
    requiredSkills: [], // Skills that must be present
    excludedKeywords: [], // Keywords to exclude
    dateRange: {
      start: null, // Start date for filtering
      end: null, // End date for filtering
    },
  },

  // Export formats
  exportFormats: {
    json: true,
    csv: true,
    excel: false, // Requires additional package
    database: false, // Requires database configuration
  },

  // Database configuration (if using database export)
  database: {
    enabled: false,
    type: "mysql", // 'mysql', 'postgresql', 'sqlite'
    host: "localhost",
    port: 3306,
    database: "jobs_db",
    username: "user",
    password: "password",
    table: "job_listings",
  },

  // Notification configuration
  notifications: {
    enabled: false,
    email: {
      smtp: "smtp.gmail.com",
      port: 587,
      secure: false,
      user: "your-email@gmail.com",
      pass: "your-password",
    },
    webhook: {
      url: "",
      method: "POST",
    },
  },

  // Custom headers for requests
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
  },

  // Proxy configuration (if needed)
  proxy: {
    enabled: false,
    server: "http://proxy-server:port",
    username: "",
    password: "",
  },

  // Custom CSS selectors for different page layouts
  customSelectors: {
    // Add custom selectors for different page types
    jobDetails: {
      requirements: ".job-requirements",
      benefits: ".job-benefits",
      location: ".job-location",
    },
  },

  // Error handling configuration
  errorHandling: {
    continueOnError: true,
    maxConsecutiveErrors: 5,
    errorLogFile: "errors.log",
    retryFailedRequests: true,
  },
};
