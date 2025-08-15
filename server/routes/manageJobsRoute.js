import express from "express";
import auth from "../middleware/auth.js";
import {
    getUserJobs,
    createJobApplication,
    updateJobApplication,
    deleteJobApplication,
    getDashboardStats
} from "../controllers/manageJobsController.js";

const router = express.Router();

// Get all jobs for the authenticated user
router.get('/my', auth, getUserJobs);

// Create a new job application
router.post('/', auth, createJobApplication);

// Update a job application
router.put('/:id', auth, updateJobApplication);

// Delete a job application
router.delete('/:id', auth, deleteJobApplication);

// Get dashboard statistics
router.get('/dashboard/stats', auth, getDashboardStats);

export default router;
