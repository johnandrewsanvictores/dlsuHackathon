import express from "express";

import auth from "../middleware/auth.js";
import {getJobInfo, getAIFilteredJobs, triggerJobScraping} from "../controllers/jobInfoController.js";

const router = express.Router();

router.get('/', getJobInfo);
router.get('/ai-filtered', auth, getAIFilteredJobs);
router.post('/scrape', auth, triggerJobScraping);

export default router;
