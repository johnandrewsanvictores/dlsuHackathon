import express from "express";
import auth from "../middleware/auth.js";
import setupSampleData from "../setup/sampleData.js";

const router = express.Router();

// Setup sample data (for demo purposes)
router.post('/setup-sample-data', auth, async (req, res) => {
    try {
        console.log('Setting up sample data...');
        await setupSampleData();
        res.json({ 
            message: 'Sample data created successfully!',
            status: 'success'
        });
    } catch (error) {
        console.error('Error setting up sample data:', error);
        res.status(500).json({ 
            error: 'Failed to setup sample data',
            details: error.message
        });
    }
});

export default router;
