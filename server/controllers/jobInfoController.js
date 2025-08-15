import jobsInfo from "../models/jobsInfoModel.js";
import jobsMoreInfo from "../models/jobsMoreInfoModel.js";
import User from "../models/userModel.js";
import UniversalJobScraper from "../services/universalJobScraper.js";
import Fuse from 'fuse.js';

export const getJobInfo = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const {sort = 'postedDate', order = 'desc', search, workArrangement, employmentType, location} = req.query;

        // Build filters
        const filters = {};
        if (search) {
            filters.$or = [
                { jobTitle: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } }
            ];
        }
        if (workArrangement && workArrangement !== 'all') {
            filters.workArrangement = workArrangement;
        }
        if (employmentType && employmentType !== 'all') {
            filters.employmentType = employmentType;
        }
        if (location && location !== 'all') {
            filters.location = { $regex: location, $options: 'i' };
        }

        const jobInfos = await jobsInfo.find(filters)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await jobsInfo.countDocuments(filters);

        res.json({
            jobInfos,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalJobs: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}

// Get AI-filtered jobs based on user's resume
export const getAIFilteredJobs = async(req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get user's resume context
        const user = await User.findById(userId).select('resumeContext');
        if (!user || !user.resumeContext) {
            return res.status(400).json({ error: 'Resume not found. Please upload your resume first.' });
        }

        // Get all jobs
        const allJobs = await jobsInfo.find({}).lean();
        
        // Extract skills from resume using AI
        const resumeSkillsData = await getSkills(user.resumeContext);
        const resumeSkillsString = resumeSkillsData.data?.hardSkills || '';
        const resumeSkills = resumeSkillsString.split(',').map(skill => skill.trim()).filter(Boolean);

        if (resumeSkills.length === 0) {
            return res.status(400).json({ error: 'No skills found in resume. Please upload a more detailed resume.' });
        }

        // Match jobs with resume skills
        const scoredJobs = await Promise.all(allJobs.map(async (job) => {
            const score = await calculateJobMatchScore(job, resumeSkills);
            return { ...job, matchScore: score };
        }));

        // Filter jobs with score > 0 and sort by score
        const filteredJobs = scoredJobs
            .filter(job => job.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(skip, skip + limit);

        const totalMatched = scoredJobs.filter(job => job.matchScore > 0).length;

        res.json({
            jobInfos: filteredJobs,
            resumeSkills,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMatched / limit),
                totalJobs: totalMatched,
                hasNextPage: page < Math.ceil(totalMatched / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error('Error fetching AI-filtered jobs:', err);
        res.status(500).json({ error: 'Failed to fetch AI-filtered jobs' });
    }
}

// Trigger job scraping
export const triggerJobScraping = async(req, res) => {
    try {
        console.log('Starting job scraping...');
        
        // Run scraping in background
        const scraper = new UniversalJobScraper();
        scraper.scrapeAllPlatforms().catch(err => {
            console.error('Background scraping error:', err);
        });

        res.json({ 
            message: 'Job scraping started in background. Jobs will be available shortly.',
            status: 'started'
        });
    } catch (err) {
        console.error('Error starting job scraping:', err);
        res.status(500).json({ error: 'Failed to start job scraping' });
    }
}

// Helper function to get skills from resume text
async function getSkills(parsedText) {
    const prompt = `
    This is parsed raw text from a resume PDF using pdfjs-dist. The content is jumbled and lacks structure. Please analyze the text and extract only the skills, prioritizing technical/hard skills from a dedicated skills section if available, and if no skills section exists, infer technical skills from other parts of the resume such as summary, experience, projects, or objectives; if no technical skills can be identified anywhere, extract soft skills instead. Send the output in valid JSON format like {"hardSkills":"skill1, skill2, skill3","softSkills":"skill1, skill2, skill3"}, including only the skill names separated by commas, and leave the value empty if no matching skills are found. This is the raw text: ${parsedText}
    `;

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsURL = `https://text.pollinations.ai/${encodedPrompt}`;

    try {
        const response = await fetch(pollinationsURL);
        const data = await response.text();
        
        // Try to parse JSON from the response
        const jsonMatch = data.match(/\{.*\}/);
        if (jsonMatch) {
            return { data: JSON.parse(jsonMatch[0]) };
        }
        
        return { data: { hardSkills: "", softSkills: "" } };
    } catch (error) {
        console.error('Error getting skills:', error);
        return { data: { hardSkills: "", softSkills: "" } };
    }
}

// Helper function to calculate job match score
async function calculateJobMatchScore(job, resumeSkills) {
    try {
        const jobText = `${job.jobTitle} ${job.shortDescription || ''} ${job.companyName}`.toLowerCase();
        
        // Use Fuse.js for fuzzy matching
        const fuse = new Fuse(resumeSkills.map(skill => skill.toLowerCase()), {
            includeScore: true,
            threshold: 0.6 // Adjust for fuzziness
        });

        let matchCount = 0;
        const jobWords = jobText.split(/\s+/);
        
        // Check each word in job description against skills
        jobWords.forEach(word => {
            const results = fuse.search(word);
            if (results.length > 0 && results[0].score < 0.6) {
                matchCount++;
            }
        });

        // Also check direct skill matches
        resumeSkills.forEach(skill => {
            if (jobText.includes(skill.toLowerCase())) {
                matchCount += 2; // Give more weight to exact matches
            }
        });

        // Calculate percentage score
        return Math.min(100, (matchCount / resumeSkills.length) * 100);
    } catch (error) {
        console.error('Error calculating match score:', error);
        return 0;
    }
}

export const getJobs = async (query) => {
    try {
        const page = query.page || 1;
        const limit = query.limit || 100;
        const skip = (page -1) * limit;

        const {sort = 'createdAt', order = 'desc'} = query;

        const filters = query;
        const jobInfos = await jobsInfo.find(filters).sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean();

            return {success: true, jobInfos};
    } catch (err) {
        return {success: false, error: err };
    }
}