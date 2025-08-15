import myJob from '../models/myjobsModel.js';
import mongoose from 'mongoose';
import myJob from "../models/myjobsModel.js";

export const createMyJobs = async (req, res) => {
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


export const updateJobStatus = async (req, res) => {
  try {
    if (!userId || !jobApplicationId || !newStatus) {
      throw new Error('Missing required parameters: userId, jobApplicationId, and newStatus are required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobApplicationId)) {
      throw new Error('Invalid ObjectId format for userId or jobApplicationId');
    }

    const validStatuses = ['applied', 'readyToInterview', 'rejected', 'hired'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate interview date if status is readyToInterview
    if (newStatus === 'readyToInterview' && !interviewDate) {
      throw new Error('Interview date is required when status is "readyToInterview"');
    }

    const { eventId, userId } = req.body;
    const {lp} = await Events.findById(eventId, {"lp": 1});
    console.log(lp);

    await User.findByIdAndUpdate(userId, {$inc: {'lp' : lp}});
    const updateReward = await Join.findOneAndUpdate(
        {$and: [
            {eventId}, {userId}
        ]},
        { $set: {isPresent : true} },
        { new: true }
    );

    res.status(200).json({ success: true, reward: updateReward, message: "Updated joined status of user successfully" });
    
    // Find the job application
    const jobApplication = await myJob.findOne({
      _id: jobApplicationId,
      userID: userId
    });

    if (!jobApplication) {
      throw new Error('Job application not found or does not belong to the specified user');
    }

    // Prepare update object
    const updateData = { status: newStatus };
    
    // Add interview date if provided and status is readyToInterview
    if (newStatus === 'readyToInterview' && interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    }

    // Clear interview date if status is not readyToInterview
    if (newStatus !== 'readyToInterview') {
      updateData.interviewDate = null;
    }

    // Update the job application
    const updatedJobApplication = await myJob.findByIdAndUpdate(
      jobApplicationId,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    return {
      success: true,
      message: 'Job status updated successfully',
      data: updatedJobApplication
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};

export const updateJobStatusHandler = async (req, res) => {
  try {
    const { jobApplicationId } = req.params;
    const { userId, status, interviewDate } = req.body;

    const result = await updateJobStatus(userId, jobApplicationId, status, interviewDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};


export const getUserJobApplications = async (userId, statusFilter = null) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const query = { userID: userId };
    if (statusFilter) {
      const validStatuses = ['applied', 'readyToInterview', 'rejected', 'hired'];
      if (!validStatuses.includes(statusFilter)) {
        throw new Error(`Invalid status filter. Must be one of: ${validStatuses.join(', ')}`);
      }
      query.status = statusFilter;
    }

    const jobApplications = await myJob.find(query)
      .populate('jobInfoId')
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Job applications retrieved successfully',
      data: jobApplications
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
};

/**
 * Express.js route handler for getting user job applications
 * GET /api/users/:userId/jobs?status=applied
 */
export const getUserJobApplicationsHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const result = await getUserJobApplications(userId, status);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};