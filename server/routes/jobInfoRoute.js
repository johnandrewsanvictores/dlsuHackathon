import express from "express";

import auth from "../middleware/auth.js";
import {getJobInfo, getAIFilteredJobs, triggerJobScraping, fetchAdzunaJobs, getAdzunaJobs} from "../controllers/jobInfoController.js";

const router = express.Router();

router.get('/', getJobInfo);
router.get('/ai-filtered', auth, getAIFilteredJobs);
router.post('/scrape', auth, triggerJobScraping);

// Adzuna API routes
router.get('/adzuna', getAdzunaJobs); // Get jobs from Adzuna without storing
router.post('/adzuna/fetch', auth, fetchAdzunaJobs); // Fetch and store jobs from Adzuna

export default router;
