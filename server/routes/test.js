import express from 'express';
import {ResumeController} from "../controllers/resumeController.js";
import auth from "../middleware/auth.js";

const router =  express.Router();

router.get('/', ResumeController)

export default router;