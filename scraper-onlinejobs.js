const puppeteer = require("puppeteer");
const fs = require("fs");

class OnlineJobsScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.jobs = [];
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: false, // Set to true for production
        defaultViewport: null,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      this.page = await this.browser.newPage();

      // Set user agent to avoid detection
      await this.page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      console.log("Scraper initialized successfully");
    } catch (error) {
      console.error("Error initializing scraper:", error);
      throw error;
    }
  }

  async scrapeJobs(
    searchUrl = "https://www.onlinejobs.ph/jobseekers/jobsearch"
  ) {
    try {
      console.log("Starting to scrape jobs from:", searchUrl);

      await this.page.goto(searchUrl, { waitUntil: "networkidle2" });

      // Wait for job listings to load
      await this.page.waitForSelector(".jobpost-cat-box", { timeout: 10000 });

      // Extract jobs from current page
      const pageJobs = await this.extractJobsFromPage();
      this.jobs.push(...pageJobs);

      console.log(`Extracted ${pageJobs.length} jobs from current page`);

      // Check if there are more pages
      const hasNextPage = await this.checkForNextPage();
      if (hasNextPage) {
        console.log(
          "More pages detected. You can implement pagination logic here."
        );
      }

      return this.jobs;
    } catch (error) {
      console.error("Error scraping jobs:", error);
      throw error;
    }
  }

  async extractJobsFromPage() {
    try {
      const jobs = await this.page.evaluate(() => {
        const jobElements = document.querySelectorAll(".jobpost-cat-box");
        const extractedJobs = [];

        jobElements.forEach((jobElement) => {
          try {
            // Extract job title
            const titleElement = jobElement.querySelector("h4");
            const title = titleElement ? titleElement.textContent.trim() : "";

            // Extract employment type badge
            const badgeElement = jobElement.querySelector(".badge");
            const employmentType = badgeElement
              ? badgeElement.textContent.trim()
              : "";

            // Extract company name and posting date
            const metaElement = jobElement.querySelector("p[data-temp]");
            let companyName = "";
            let postingDate = "";

            if (metaElement) {
              const metaText = metaElement.textContent;
              const parts = metaText.split("•");
              if (parts.length >= 2) {
                companyName = parts[0].trim();
                const dateMatch = parts[1].match(/Posted on (.+)/);
                postingDate = dateMatch ? dateMatch[1].trim() : "";
              }
            }

            // Extract salary/compensation
            const salaryElement = jobElement.querySelector("dd.col");
            const salary = salaryElement
              ? salaryElement.textContent.trim()
              : "";

            // Extract job description
            const descElement = jobElement.querySelector(".desc");
            const description = descElement
              ? descElement.textContent.trim()
              : "";

            // Extract skills/tags
            const skillElements =
              jobElement.querySelectorAll(".job-tag .badge");
            const skills = Array.from(skillElements).map((skill) =>
              skill.textContent.trim()
            );

            // Extract job URL
            const linkElement = jobElement.closest("a");
            const jobUrl = linkElement ? linkElement.href : "";

            // Extract company logo if available
            const logoElement = jobElement.querySelector(
              ".jobpost-cat-box-logo"
            );
            const companyLogo = logoElement ? logoElement.src : "";

            const job = {
              title,
              employmentType,
              companyName,
              postingDate,
              salary,
              description,
              skills,
              jobUrl,
              companyLogo,
              scrapedAt: new Date().toISOString(),
            };

            extractedJobs.push(job);
          } catch (error) {
            console.error("Error extracting individual job:", error);
          }
        });

        return extractedJobs;
      });

      return jobs;
    } catch (error) {
      console.error("Error extracting jobs from page:", error);
      return [];
    }
  }

  async checkForNextPage() {
    try {
      const hasNextPage = await this.page.evaluate(() => {
        const nextButton = document.querySelector('a[rel="next"]');
        return !!nextButton;
      });
      return hasNextPage;
    } catch (error) {
      console.error("Error checking for next page:", error);
      return false;
    }
  }

  async scrapeMultiplePages(maxPages = 5) {
    try {
      console.log(`Starting to scrape up to ${maxPages} pages`);

      let currentPage = 1;
      let hasMorePages = true;

      while (currentPage <= maxPages && hasMorePages) {
        console.log(`Scraping page ${currentPage}...`);

        if (currentPage === 1) {
          // First page is already loaded
          const pageJobs = await this.extractJobsFromPage();
          this.jobs.push(...pageJobs);
        } else {
          // Navigate to next page
          const nextPageUrl = `https://www.onlinejobs.ph/jobseekers/jobsearch/${
            (currentPage - 1) * 30
          }`;
          await this.page.goto(nextPageUrl, { waitUntil: "networkidle2" });
          await this.page.waitForSelector(".jobpost-cat-box", {
            timeout: 10000,
          });

          const pageJobs = await this.extractJobsFromPage();
          this.jobs.push(...pageJobs);
        }

        console.log(
          `Page ${currentPage} completed. Total jobs so far: ${this.jobs.length}`
        );

        // Check if there's a next page
        hasMorePages = await this.checkForNextPage();
        currentPage++;

        // Add delay between pages to be respectful
        if (hasMorePages && currentPage <= maxPages) {
          await this.delay(2000);
        }
      }

      console.log(
        `Scraping completed. Total jobs collected: ${this.jobs.length}`
      );
      return this.jobs;
    } catch (error) {
      console.error("Error scraping multiple pages:", error);
      throw error;
    }
  }

  async searchJobs(keyword = "", skills = [], employmentTypes = []) {
    try {
      console.log(
        `Searching for jobs with keyword: "${keyword}", skills: [${skills.join(
          ", "
        )}], types: [${employmentTypes.join(", ")}]`
      );

      const searchUrl = "https://www.onlinejobs.ph/jobseekers/jobsearch";
      await this.page.goto(searchUrl, { waitUntil: "networkidle2" });

      // Fill in search keyword if provided
      if (keyword) {
        await this.page.waitForSelector("#jobkeyword");
        await this.page.type("#jobkeyword", keyword);
      }

      // Select skills if provided
      if (skills.length > 0) {
        for (const skill of skills.slice(0, 3)) {
          // Max 3 skills allowed
          await this.page.waitForSelector("#js-skill-search");
          await this.page.type("#js-skill-search", skill);
          await this.delay(1000);

          // Click on the skill suggestion
          const skillSuggestion = await this.page.$(`text=${skill}`);
          if (skillSuggestion) {
            await skillSuggestion.click();
          }
        }
      }

      // Select employment types if provided
      if (employmentTypes.length > 0) {
        for (const type of employmentTypes) {
          const checkboxId = this.getCheckboxId(type);
          if (checkboxId) {
            await this.page.waitForSelector(`#${checkboxId}`);
            await this.page.click(`#${checkboxId}`);
          }
        }
      }

      // Submit search
      await this.page.click('button[type="submit"]');
      await this.page.waitForSelector(".jobpost-cat-box", { timeout: 10000 });

      // Extract results
      const searchResults = await this.extractJobsFromPage();
      this.jobs = searchResults;

      console.log(`Search completed. Found ${searchResults.length} jobs`);
      return searchResults;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  }

  getCheckboxId(employmentType) {
    const mapping = {
      gig: "gig",
      "part-time": "Part-time",
      "full-time": "Full-time",
      any: "any",
    };
    return mapping[employmentType.toLowerCase()];
  }

  async saveToFile(filename = "onlinejobs_data.json") {
    try {
      const data = {
        totalJobs: this.jobs.length,
        scrapedAt: new Date().toISOString(),
        jobs: this.jobs,
      };

      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`Data saved to ${filename}`);
      return filename;
    } catch (error) {
      console.error("Error saving to file:", error);
      throw error;
    }
  }

  async saveToCSV(filename = "onlinejobs_data.csv") {
    try {
      if (this.jobs.length === 0) {
        console.log("No jobs to save");
        return;
      }

      const headers = [
        "Title",
        "Employment Type",
        "Company Name",
        "Posting Date",
        "Salary",
        "Description",
        "Skills",
        "Job URL",
        "Company Logo",
        "Scraped At",
      ];

      const csvContent = [
        headers.join(","),
        ...this.jobs.map((job) =>
          [
            `"${job.title.replace(/"/g, '""')}"`,
            `"${job.employmentType}"`,
            `"${job.companyName.replace(/"/g, '""')}"`,
            `"${job.postingDate}"`,
            `"${job.salary.replace(/"/g, '""')}"`,
            `"${job.description.replace(/"/g, '""')}"`,
            `"${job.skills.join("; ")}"`,
            `"${job.jobUrl}"`,
            `"${job.companyLogo}"`,
            `"${job.scrapedAt}"`,
          ].join(",")
        ),
      ].join("\n");

      fs.writeFileSync(filename, csvContent);
      console.log(`Data saved to ${filename}`);
      return filename;
    } catch (error) {
      console.error("Error saving to CSV:", error);
      throw error;
    }
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        console.log("Browser closed");
      }
    } catch (error) {
      console.error("Error closing browser:", error);
    }
  }

  // Get statistics about scraped data
  getStats() {
    if (this.jobs.length === 0) {
      return { message: "No jobs scraped yet" };
    }

    const stats = {
      totalJobs: this.jobs.length,
      employmentTypes: {},
      topSkills: {},
      salaryRanges: {
        "Under $500": 0,
        "$500 - $1000": 0,
        "$1000 - $2000": 0,
        "$2000 - $5000": 0,
        "Over $5000": 0,
        "Not specified": 0,
      },
      companies: {},
      recentPostings: 0,
    };

    this.jobs.forEach((job) => {
      // Count employment types
      stats.employmentTypes[job.employmentType] =
        (stats.employmentTypes[job.employmentType] || 0) + 1;

      // Count skills
      job.skills.forEach((skill) => {
        stats.topSkills[skill] = (stats.topSkills[skill] || 0) + 1;
      });

      // Count companies
      stats.companies[job.companyName] =
        (stats.companies[job.companyName] || 0) + 1;

      // Check if posted recently (within last 7 days)
      if (job.postingDate) {
        const postingDate = new Date(job.postingDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (postingDate > weekAgo) {
          stats.recentPostings++;
        }
      }
    });

    // Sort skills by frequency
    stats.topSkills = Object.fromEntries(
      Object.entries(stats.topSkills)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
    );

    return stats;
  }
}

// Example usage
async function main() {
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Option 1: Scrape current page
    // await scraper.scrapeJobs();

    // Option 2: Scrape multiple pages
    await scraper.scrapeMultiplePages(3);

    // Option 3: Search with specific criteria
    // await scraper.searchJobs('developer', ['JavaScript', 'React'], ['full-time']);

    // Save data
    await scraper.saveToFile("onlinejobs_data.json");
    await scraper.saveToCSV("onlinejobs_data.csv");

    // Get statistics
    const stats = scraper.getStats();
    console.log("Scraping Statistics:", JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Main error:", error);
  } finally {
    await scraper.close();
  }
}

// Export the scraper class
module.exports = OnlineJobsScraper;

// Run if this file is executed directly
if (require.main === module) {
  main();
}
