const OnlineJobsScraper = require("./scraper-onlinejobs.js");

// Example 1: Basic scraping
async function basicScraping() {
  console.log("=== Basic Scraping Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Scrape just the first page
    await scraper.scrapeJobs();

    // Save results
    await scraper.saveToFile("basic_scraping.json");
    await scraper.saveToCSV("basic_scraping.csv");

    console.log(`Scraped ${scraper.jobs.length} jobs`);
  } finally {
    await scraper.close();
  }
}

// Example 2: Multi-page scraping
async function multiPageScraping() {
  console.log("=== Multi-Page Scraping Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Scrape 5 pages
    await scraper.scrapeMultiplePages(5);

    // Save results
    await scraper.saveToFile("multi_page_scraping.json");
    await scraper.saveToCSV("multi_page_scraping.csv");

    // Get statistics
    const stats = scraper.getStats();
    console.log("Scraping Statistics:", JSON.stringify(stats, null, 2));
  } finally {
    await scraper.close();
  }
}

// Example 3: Search with specific criteria
async function searchSpecificJobs() {
  console.log("=== Search Specific Jobs Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Search for developer jobs with specific skills
    await scraper.searchJobs(
      "developer",
      ["JavaScript", "React"],
      ["full-time"]
    );

    // Save results
    await scraper.saveToFile("developer_jobs.json");
    await scraper.saveToCSV("developer_jobs.csv");

    console.log(`Found ${scraper.jobs.length} developer jobs`);
  } finally {
    await scraper.close();
  }
}

// Example 4: Marketing jobs search
async function searchMarketingJobs() {
  console.log("=== Search Marketing Jobs Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Search for marketing jobs
    await scraper.searchJobs(
      "marketing",
      ["SEO", "Social Media"],
      ["part-time", "full-time"]
    );

    // Save results
    await scraper.saveToFile("marketing_jobs.json");
    await scraper.saveToCSV("marketing_jobs.csv");

    console.log(`Found ${scraper.jobs.length} marketing jobs`);
  } finally {
    await scraper.close();
  }
}

// Example 5: Remote/freelance jobs
async function searchRemoteJobs() {
  console.log("=== Search Remote Jobs Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Search for remote/freelance jobs
    await scraper.searchJobs("", [], ["gig", "part-time"]);

    // Save results
    await scraper.saveToFile("remote_jobs.json");
    await scraper.saveToCSV("remote_jobs.csv");

    console.log(`Found ${scraper.jobs.length} remote/freelance jobs`);
  } finally {
    await scraper.close();
  }
}

// Example 6: Data analysis and filtering
async function dataAnalysis() {
  console.log("=== Data Analysis Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Scrape some data first
    await scraper.scrapeMultiplePages(3);

    // Filter jobs by salary (example: jobs with salary information)
    const jobsWithSalary = scraper.jobs.filter(
      (job) => job.salary && job.salary !== "" && job.salary !== "TBD"
    );

    console.log(`Total jobs: ${scraper.jobs.length}`);
    console.log(`Jobs with salary info: ${jobsWithSalary.length}`);

    // Filter by recent postings (last 7 days)
    const recentJobs = scraper.jobs.filter((job) => {
      if (!job.postingDate) return false;
      const postingDate = new Date(job.postingDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postingDate > weekAgo;
    });

    console.log(`Recent jobs (last 7 days): ${recentJobs.length}`);

    // Find jobs with specific skills
    const javascriptJobs = scraper.jobs.filter((job) =>
      job.skills.some(
        (skill) =>
          skill.toLowerCase().includes("javascript") ||
          skill.toLowerCase().includes("js")
      )
    );

    console.log(`JavaScript jobs: ${javascriptJobs.length}`);

    // Save filtered results
    const filteredData = {
      totalJobs: scraper.jobs.length,
      jobsWithSalary,
      recentJobs,
      javascriptJobs,
      scrapedAt: new Date().toISOString(),
    };

    require("fs").writeFileSync(
      "filtered_analysis.json",
      JSON.stringify(filteredData, null, 2)
    );
    console.log("Filtered analysis saved to filtered_analysis.json");
  } finally {
    await scraper.close();
  }
}

// Example 7: Custom search combinations
async function customSearchCombinations() {
  console.log("=== Custom Search Combinations Example ===");
  const scraper = new OnlineJobsScraper();

  try {
    await scraper.initialize();

    // Search combinations
    const searchQueries = [
      {
        keyword: "designer",
        skills: ["Photoshop", "Illustrator"],
        types: ["full-time"],
      },
      {
        keyword: "writer",
        skills: ["Content Writing", "SEO"],
        types: ["part-time", "gig"],
      },
      {
        keyword: "manager",
        skills: ["Project Management"],
        types: ["full-time"],
      },
      { keyword: "assistant", skills: [], types: ["part-time", "full-time"] },
    ];

    for (const query of searchQueries) {
      console.log(
        `\nSearching for: ${
          query.keyword || "Any"
        } jobs with skills: [${query.skills.join(
          ", "
        )}] and types: [${query.types.join(", ")}]`
      );

      await scraper.searchJobs(query.keyword, query.skills, query.types);

      // Save results for each search
      const filename = `search_${query.keyword || "any"}_${Date.now()}.json`;
      await scraper.saveToFile(filename);

      console.log(`Found ${scraper.jobs.length} jobs, saved to ${filename}`);

      // Clear jobs for next search
      scraper.jobs = [];

      // Delay between searches
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } finally {
    await scraper.close();
  }
}

// Main function to run examples
async function runExamples() {
  console.log("🚀 OnlineJobs.ph Scraper Examples\n");

  try {
    // Uncomment the examples you want to run

    // await basicScraping();
    // await multiPageScraping();
    // await searchSpecificJobs();
    // await searchMarketingJobs();
    // await searchRemoteJobs();
    // await dataAnalysis();
    // await customSearchCombinations();

    // Run basic scraping by default
    await basicScraping();
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

// Export functions for use in other files
module.exports = {
  basicScraping,
  multiPageScraping,
  searchSpecificJobs,
  searchMarketingJobs,
  searchRemoteJobs,
  dataAnalysis,
  customSearchCombinations,
};
