import express from 'express';
import auth from "../middleware/auth.js";
import { 
  updateJobStatusHandler, 
  getUserJobApplicationsHandler 
} from '../controllers/jobController.js';

const router = express.Router();

router.put('/updateStatus', auth, updateJobStatusHandler);
router.get('/getStatus', auth, getUserJobApplicationsHandler);
