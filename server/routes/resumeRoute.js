import express from "express";

import auth from "../middleware/auth.js";
import {getResumeContext} from "../controllers/resumeController.js";
import upload from "../middleware/resumeUploadMiddleWare.js";

const router = express.Router();

router.post('/get-resume-context', auth,  upload.single("resume"), getResumeContext);

export default router;
