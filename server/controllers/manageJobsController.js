import MyJob from '../models/myjobsModel.js';
import mongoose from 'mongoose';

export const updateJobStatus = async (userId, jobId, newStatus, interviewDate = null) => {
  try {
    // Validate input parameters
    if (!userId || !jobId || !newStatus) {
      return {
        success: false,
        message: 'Missing required parameters: userId, jobId, and newStatus are required'
      };
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: 'Invalid userId format'
      };
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return {
        success: false,
        message: 'Invalid jobId format'
      };
    }

    // Validate status enum
    const validStatuses = ['applied', 'readyToInterview', 'rejected', 'hired'];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      };
    }

    // Check if interview date is required for readyToInterview status
    if (newStatus === 'readyToInterview' && !interviewDate) {
      return {
        success: false,
        message: 'Interview date is required when status is set to readyToInterview'
      };
    }

    // Find the job application
    const jobApplication = await MyJob.findOne({
      _id: jobId,
      userID: userId
    });

    if (!jobApplication) {
      return {
        success: false,
        message: 'Job application not found or does not belong to the specified user'
      };
    }

    // Prepare update object
    const updateData = {
      status: newStatus,
      updatedAt: new Date()
    };

    // Add interview date if provided or if status is readyToInterview
    if (newStatus === 'readyToInterview' && interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    } else if (newStatus !== 'readyToInterview') {
      // Clear interview date if status is not readyToInterview
      updateData.interviewDate = jobApplication.interviewDate;
    }

    // Update the job application
    const updatedJob = await MyJob.findByIdAndUpdate(
      jobId,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    return {
      success: true,
      message: 'Job status updated successfully',
      data: updatedJob
    };

  } catch (error) {
    console.error('Error updating job status:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return {
        success: false,
        message: 'Validation error: ' + error.message
      };
    }

    if (error.name === 'CastError') {
      return {
        success: false,
        message: 'Invalid data format provided'
      };
    }

    return {
      success: false,
      message: 'An error occurred while updating job status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

export const updateJobStatusHandler = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const { status, interviewDate } = req.body;

    const result = await updateJobStatus(userId, jobId, status, interviewDate);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }

  } catch (error) {
    console.error('Error in updateJobStatusHandler:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};