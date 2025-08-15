import jobsInfo from "../models/jobsInfoModel.js";
import jobsMoreInfo from "../models/jobsMoreInfoModel.js";
import myJob from "../models/myjobsModel.js";
import mongoose from "mongoose";

// Get all jobs for a user with populated job info
export const getUserJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Aggregate to get jobs with populated job info
        const jobs = await myJob.aggregate([
            { $match: { userID: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'jobsinfos',
                    localField: 'jobInFold',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            {
                $lookup: {
                    from: 'jobsmoreinfos',
                    localField: 'jobInFold',
                    foreignField: 'jobInfold',
                    as: 'moreInfo'
                }
            },
            {
                $unwind: {
                    path: '$jobInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$moreInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json({ jobs });
    } catch (err) {
        console.error('Error fetching user jobs:', err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

// Create a new job application
export const createJobApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const userId = req.user.userId;
        const { jobInfo, myJob: myJobData, moreInfo } = req.body;

        // Create job info
        const [createdJobInfo] = await jobsInfo.create([jobInfo], { session });
        
        // Create more info if provided
        let createdMoreInfo = null;
        if (moreInfo && Object.keys(moreInfo).length > 0) {
            createdMoreInfo = await jobsMoreInfo.create([{
                ...moreInfo,
                jobInfold: createdJobInfo._id
            }], { session });
        }

        // Create my job entry
        const [createdMyJob] = await myJob.create([{
            ...myJobData,
            userID: userId,
            jobInFold: createdJobInfo._id
        }], { session });

        await session.commitTransaction();

        // Return the created job with populated info
        const populatedJob = await myJob.aggregate([
            { $match: { _id: createdMyJob._id } },
            {
                $lookup: {
                    from: 'jobsinfos',
                    localField: 'jobInFold',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            {
                $lookup: {
                    from: 'jobsmoreinfos',
                    localField: 'jobInFold',
                    foreignField: 'jobInfold',
                    as: 'moreInfo'
                }
            },
            {
                $unwind: {
                    path: '$jobInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$moreInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        res.status(201).json({ job: populatedJob[0] });
    } catch (err) {
        await session.abortTransaction();
        console.error('Error creating job application:', err);
        res.status(500).json({ error: 'Failed to create job application' });
    } finally {
        session.endSession();
    }
};

// Update a job application
export const updateJobApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { jobInfo, myJob: myJobData, moreInfo } = req.body;

        // Find the existing job
        const existingJob = await myJob.findOne({ 
            _id: id, 
            userID: userId 
        }).session(session);

        if (!existingJob) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Job not found' });
        }

        // Update job info
        if (jobInfo) {
            await jobsInfo.findByIdAndUpdate(
                existingJob.jobInFold,
                { $set: jobInfo },
                { session }
            );
        }

        // Update my job data
        if (myJobData) {
            await myJob.findByIdAndUpdate(
                id,
                { $set: myJobData },
                { session }
            );
        }

        // Update more info
        if (moreInfo) {
            await jobsMoreInfo.findOneAndUpdate(
                { jobInfold: existingJob.jobInFold },
                { $set: moreInfo },
                { session, upsert: true }
            );
        }

        await session.commitTransaction();

        // Return updated job with populated info
        const updatedJob = await myJob.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'jobsinfos',
                    localField: 'jobInFold',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            {
                $lookup: {
                    from: 'jobsmoreinfos',
                    localField: 'jobInFold',
                    foreignField: 'jobInfold',
                    as: 'moreInfo'
                }
            },
            {
                $unwind: {
                    path: '$jobInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$moreInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        res.json({ job: updatedJob[0] });
    } catch (err) {
        await session.abortTransaction();
        console.error('Error updating job application:', err);
        res.status(500).json({ error: 'Failed to update job application' });
    } finally {
        session.endSession();
    }
};

// Delete a job application
export const deleteJobApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Find the existing job
        const existingJob = await myJob.findOne({ 
            _id: id, 
            userID: userId 
        }).session(session);

        if (!existingJob) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Job not found' });
        }

        // Delete related records
        await jobsMoreInfo.deleteOne({ jobInfold: existingJob.jobInFold }, { session });
        await jobsInfo.deleteOne({ _id: existingJob.jobInFold }, { session });
        await myJob.deleteOne({ _id: id }, { session });

        await session.commitTransaction();
        res.json({ message: 'Job application deleted successfully' });
    } catch (err) {
        await session.abortTransaction();
        console.error('Error deleting job application:', err);
        res.status(500).json({ error: 'Failed to delete job application' });
    } finally {
        session.endSession();
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get basic counts
        const totalApplications = await myJob.countDocuments({ userID: userId });
        
        // Get status breakdown
        const statusBreakdown = await myJob.aggregate([
            { $match: { userID: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get recent activity (last 5)
        const recentActivity = await myJob.aggregate([
            { $match: { userID: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'jobsinfos',
                    localField: 'jobInFold',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            { $unwind: '$jobInfo' },
            { $sort: { updatedAt: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    updatedAt: 1,
                    'jobInfo.jobTitle': 1,
                    'jobInfo.companyName': 1
                }
            }
        ]);

        // Get upcoming interviews
        const upcomingInterviews = await myJob.aggregate([
            { 
                $match: { 
                    userID: new mongoose.Types.ObjectId(userId),
                    interviewDate: { $gte: new Date() }
                } 
            },
            {
                $lookup: {
                    from: 'jobsinfos',
                    localField: 'jobInFold',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },
            { $unwind: '$jobInfo' },
            { $sort: { interviewDate: 1 } },
            { $limit: 5 }
        ]);

        // Format status breakdown
        const formattedStatusBreakdown = {
            pending: 0,
            interviewReady: 0,
            rejected: 0,
            hired: 0
        };

        statusBreakdown.forEach(item => {
            if (item._id === 'applied') formattedStatusBreakdown.pending = item.count;
            else if (item._id === 'readyForInterview') formattedStatusBreakdown.interviewReady = item.count;
            else if (item._id === 'rejected') formattedStatusBreakdown.rejected = item.count;
            else if (item._id === 'hired') formattedStatusBreakdown.hired = item.count;
        });

        res.json({
            totalApplications,
            interviewsScheduled: upcomingInterviews.length,
            pendingResponses: formattedStatusBreakdown.pending,
            statusBreakdown: formattedStatusBreakdown,
            recentActivity: recentActivity.map(activity => ({
                id: activity._id,
                type: 'status_updated',
                jobTitle: activity.jobInfo.jobTitle,
                company: activity.jobInfo.companyName,
                timeAgo: getTimeAgo(activity.updatedAt),
                icon: '📊'
            })),
            upcomingInterviews: upcomingInterviews.map(interview => ({
                id: interview._id,
                jobTitle: interview.jobInfo.jobTitle,
                company: interview.jobInfo.companyName,
                date: formatInterviewDate(interview.interviewDate),
                badge: interview.status === 'readyForInterview' ? 'Scheduled' : 'Pending'
            }))
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};

// Helper functions
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
}

function formatInterviewDate(date) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
