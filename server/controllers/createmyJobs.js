import myJob from "../models/myjobsModel.js";

export const createMyJobs= async (req, res) => {
    try {
        const {jobInfoId} = req.body;
        const userId = req.user._id;

        const jobExist = await myJob.findOne({jobInfoId})
        const userExist = await myJob.findOne({userId})

        const existingApplication = await myJob.findOne({ jobInfoId, userId });
        if (existingApplication) {
            return res.status(409).json({ error: "Job already exists in the database" });
        }


        const jobApplied = await myJob.create({userId, jobInfoId, applicationStatus});

        res.status(201).json({
            jobApplied: {
                userId,
                jobInfoId
            },
            success: "true",
            message: "Job created successfully"
        });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

