import express from "express";

import auth from "../middleware/auth.js";
import {filterListingByResume, getResumeContext} from "../controllers/resumeController.js";
import upload from "../middleware/resumeUploadMiddleWare.js";

const router = express.Router();

router.post('/upload', auth, upload.single("resume"), getResumeContext);
router.post('/filter-jobs', auth, filterListingByResume);

export default router;
