import puppeteer from "puppeteer";
import jobsInfo from "../models/jobsInfoModel.js";
import jobsMoreInfo from "../models/jobsMoreInfoModel.js";

class UniversalJobScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.jobs = [];
    }

    async initialize() {
        try {
            this.browser = await puppeteer.launch({
                headless: true, // Set to false for debugging
                defaultViewport: null,
                args: [
                    "--no-sandbox", 
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu"
                ],
            });
            this.page = await this.browser.newPage();

            // Set user agent to avoid detection
            await this.page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            );

            console.log("Universal scraper initialized successfully");
        } catch (error) {
            console.error("Error initializing scraper:", error);
            throw error;
        }
    }

    // Scrape OnlineJobs.ph
    async scrapeOnlineJobs(maxPages = 3) {
        try {
            console.log("Starting to scrape OnlineJobs.ph...");
            const baseUrl = "https://www.onlinejobs.ph/jobseekers/jobsearch";
            
            for (let page = 0; page < maxPages; page++) {
                const pageUrl = page === 0 ? baseUrl : `${baseUrl}/${page * 30}`;
                await this.page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 30000 });

                try {
                    await this.page.waitForSelector(".jobpost-cat-box", { timeout: 10000 });
                } catch (err) {
                    console.log(`No jobs found on page ${page + 1}`);
                    continue;
                }

                const pageJobs = await this.extractOnlineJobsFromPage();
                
                // Save jobs to database
                for (const job of pageJobs) {
                    await this.saveJobToDatabase(job, 'onlinejobs.ph');
                }

                console.log(`OnlineJobs.ph - Page ${page + 1}: Found ${pageJobs.length} jobs`);
                await this.delay(2000); // Be respectful
            }

            console.log("OnlineJobs.ph scraping completed");
        } catch (error) {
            console.error("Error scraping OnlineJobs.ph:", error);
        }
    }

    // Scrape Indeed (basic implementation)
    async scrapeIndeed(query = "developer", location = "Philippines", maxPages = 3) {
        try {
            console.log("Starting to scrape Indeed...");
            
            for (let page = 0; page < maxPages; page++) {
                const start = page * 10;
                const url = `https://ph.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&start=${start}`;
                
                await this.page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

                try {
                    await this.page.waitForSelector('[data-testid="job-title"]', { timeout: 10000 });
                } catch (err) {
                    console.log(`No jobs found on Indeed page ${page + 1}`);
                    continue;
                }

                const pageJobs = await this.extractIndeedFromPage();
                
                // Save jobs to database
                for (const job of pageJobs) {
                    await this.saveJobToDatabase(job, 'indeed.com');
                }

                console.log(`Indeed - Page ${page + 1}: Found ${pageJobs.length} jobs`);
                await this.delay(3000); // Be more respectful to Indeed
            }

            console.log("Indeed scraping completed");
        } catch (error) {
            console.error("Error scraping Indeed:", error);
        }
    }

    // Scrape JobStreet (basic implementation)
    async scrapeJobStreet(query = "developer", maxPages = 3) {
        try {
            console.log("Starting to scrape JobStreet...");
            
            for (let page = 1; page <= maxPages; page++) {
                const url = `https://www.jobstreet.com.ph/jobs?keywords=${encodeURIComponent(query)}&page=${page}`;
                
                await this.page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

                try {
                    await this.page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });
                } catch (err) {
                    console.log(`No jobs found on JobStreet page ${page}`);
                    continue;
                }

                const pageJobs = await this.extractJobStreetFromPage();
                
                // Save jobs to database
                for (const job of pageJobs) {
                    await this.saveJobToDatabase(job, 'jobstreet.com.ph');
                }

                console.log(`JobStreet - Page ${page}: Found ${pageJobs.length} jobs`);
                await this.delay(3000);
            }

            console.log("JobStreet scraping completed");
        } catch (error) {
            console.error("Error scraping JobStreet:", error);
        }
    }

    async extractOnlineJobsFromPage() {
        return await this.page.evaluate(() => {
            const jobElements = document.querySelectorAll(".jobpost-cat-box");
            const extractedJobs = [];

            jobElements.forEach((jobElement) => {
                try {
                    const titleElement = jobElement.querySelector("h4");
                    const title = titleElement ? titleElement.textContent.trim() : "";

                    const badgeElement = jobElement.querySelector(".badge");
                    const employmentType = badgeElement ? badgeElement.textContent.trim() : "";

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

                    const salaryElement = jobElement.querySelector("dd.col");
                    const salary = salaryElement ? salaryElement.textContent.trim() : "";

                    const descElement = jobElement.querySelector(".desc");
                    const description = descElement ? descElement.textContent.trim() : "";

                    const skillElements = jobElement.querySelectorAll(".job-tag .badge");
                    const skills = Array.from(skillElements).map((skill) => skill.textContent.trim());

                    const linkElement = jobElement.closest("a");
                    const jobUrl = linkElement ? linkElement.href : "";

                    if (title && companyName) {
                        extractedJobs.push({
                            jobTitle: title,
                            companyName,
                            employmentType: this.mapEmploymentType(employmentType),
                            location: "Philippines", // Default for OnlineJobs.ph
                            workArrangement: "remote", // Most OnlineJobs are remote
                            postedDate: postingDate ? new Date(postingDate) : new Date(),
                            shortDescription: description,
                            applicationLink: jobUrl,
                            skills,
                            salary
                        });
                    }
                } catch (error) {
                    console.error("Error extracting individual OnlineJobs job:", error);
                }
            });

            return extractedJobs;
        });
    }

    async extractIndeedFromPage() {
        return await this.page.evaluate(() => {
            const jobElements = document.querySelectorAll('[data-testid="job-title"]');
            const extractedJobs = [];

            jobElements.forEach((titleElement) => {
                try {
                    const jobCard = titleElement.closest('[data-testid="slider_item"]') || titleElement.closest('.jobsearch-SerpJobCard');
                    if (!jobCard) return;

                    const title = titleElement.textContent.trim();
                    
                    const companyElement = jobCard.querySelector('[data-testid="company-name"]') || 
                                         jobCard.querySelector('.companyName');
                    const companyName = companyElement ? companyElement.textContent.trim() : "";

                    const locationElement = jobCard.querySelector('[data-testid="job-location"]') || 
                                          jobCard.querySelector('.companyLocation');
                    const location = locationElement ? locationElement.textContent.trim() : "";

                    const salaryElement = jobCard.querySelector('[data-testid="attribute_snippet_testid"]') || 
                                        jobCard.querySelector('.salaryText');
                    const salary = salaryElement ? salaryElement.textContent.trim() : "";

                    const descElement = jobCard.querySelector('[data-testid="job-snippet"]') || 
                                      jobCard.querySelector('.summary');
                    const description = descElement ? descElement.textContent.trim() : "";

                    const linkElement = titleElement.closest('a');
                    const jobUrl = linkElement ? `https://ph.indeed.com${linkElement.getAttribute('href')}` : "";

                    if (title && companyName) {
                        extractedJobs.push({
                            jobTitle: title,
                            companyName,
                            location: location || "Philippines",
                            workArrangement: "onSite", // Default for Indeed
                            employmentType: "fullTime", // Default
                            postedDate: new Date(),
                            shortDescription: description,
                            applicationLink: jobUrl,
                            salary
                        });
                    }
                } catch (error) {
                    console.error("Error extracting individual Indeed job:", error);
                }
            });

            return extractedJobs;
        });
    }

    async extractJobStreetFromPage() {
        return await this.page.evaluate(() => {
            const jobElements = document.querySelectorAll('[data-testid="job-card"]');
            const extractedJobs = [];

            jobElements.forEach((jobCard) => {
                try {
                    const titleElement = jobCard.querySelector('h3 a') || jobCard.querySelector('[data-testid="job-title"]');
                    const title = titleElement ? titleElement.textContent.trim() : "";

                    const companyElement = jobCard.querySelector('[data-testid="company-name"]') || 
                                         jobCard.querySelector('.company-name');
                    const companyName = companyElement ? companyElement.textContent.trim() : "";

                    const locationElement = jobCard.querySelector('[data-testid="job-location"]') || 
                                          jobCard.querySelector('.location');
                    const location = locationElement ? locationElement.textContent.trim() : "";

                    const salaryElement = jobCard.querySelector('[data-testid="job-salary"]') || 
                                        jobCard.querySelector('.salary');
                    const salary = salaryElement ? salaryElement.textContent.trim() : "";

                    const descElement = jobCard.querySelector('.job-description') || 
                                      jobCard.querySelector('[data-testid="job-description"]');
                    const description = descElement ? descElement.textContent.trim() : "";

                    const linkElement = titleElement;
                    const jobUrl = linkElement ? `https://www.jobstreet.com.ph${linkElement.getAttribute('href')}` : "";

                    if (title && companyName) {
                        extractedJobs.push({
                            jobTitle: title,
                            companyName,
                            location: location || "Philippines",
                            workArrangement: "onSite", // Default for JobStreet
                            employmentType: "fullTime", // Default
                            postedDate: new Date(),
                            shortDescription: description,
                            applicationLink: jobUrl,
                            salary
                        });
                    }
                } catch (error) {
                    console.error("Error extracting individual JobStreet job:", error);
                }
            });

            return extractedJobs;
        });
    }

    mapEmploymentType(type) {
        const mapping = {
            'full-time': 'fullTime',
            'part-time': 'partTime',
            'contract': 'contract',
            'freelance': 'contract',
            'internship': 'internship',
            'gig': 'contract'
        };
        return mapping[type.toLowerCase()] || 'fullTime';
    }

    async saveJobToDatabase(jobData, sourceSite) {
        try {
            // Check if job already exists
            const existingJob = await jobsInfo.findOne({
                jobTitle: jobData.jobTitle,
                companyName: jobData.companyName,
                applicationLink: jobData.applicationLink
            });

            if (existingJob) {
                return; // Skip if job already exists
            }

            // Create job info
            const createdJobInfo = await jobsInfo.create({
                jobTitle: jobData.jobTitle,
                companyName: jobData.companyName,
                location: jobData.location,
                workArrangement: jobData.workArrangement,
                employmentType: jobData.employmentType,
                postedDate: jobData.postedDate,
                shortDescription: jobData.shortDescription,
                applicationLink: jobData.applicationLink,
                industry: "Technology", // Default
                experienceLevel: "Mid-level" // Default
            });

            // Create more info
            await jobsMoreInfo.create({
                jobInfold: createdJobInfo._id,
                sourceSite: sourceSite,
                sourceUrl: jobData.applicationLink,
                originalJobId: jobData.applicationLink
            });

            console.log(`Saved job: ${jobData.jobTitle} at ${jobData.companyName}`);
        } catch (error) {
            console.error(`Error saving job to database: ${jobData.jobTitle}`, error);
        }
    }

    async scrapeAllPlatforms() {
        try {
            await this.initialize();
            
            // Scrape multiple platforms
            await this.scrapeOnlineJobs(2);
            await this.delay(5000);
            
            await this.scrapeIndeed("developer", "Philippines", 2);
            await this.delay(5000);
            
            await this.scrapeJobStreet("developer", 2);
            
            console.log("All platforms scraped successfully");
        } catch (error) {
            console.error("Error in scrapeAllPlatforms:", error);
        } finally {
            await this.close();
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
}

export default UniversalJobScraper;
