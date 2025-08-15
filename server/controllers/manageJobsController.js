import myJob from '../models/myjobsModel.js';
import mongoose from 'mongoose';

/**
 * Update the status of a user's job application
 * @param {string} userId - The ID of the user
 * @param {string} jobApplicationId - The ID of the job application (myJob document)
 * @param {string} newStatus - The new status ('applied', 'readyToInterview', 'rejected', 'hired')
 * @param {Date} interviewDate - Optional interview date (required if status is 'readyToInterview')
 * @returns {Object} Updated job application or error
 */


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
        new: true, // Return the updated document
        runValidators: true // Run schema validators
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

/**
 * Express.js route handler for updating job status
 * PUT /api/jobs/:jobApplicationId/status
 */
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

/**
 * Get all job applications for a user with optional status filter
 * @param {string} userId - The ID of the user
 * @param {string} statusFilter - Optional status to filter by
 * @returns {Object} Array of job applications or error
 */
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