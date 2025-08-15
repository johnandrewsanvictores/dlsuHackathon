import mongoose from 'mongoose';

const myJobsSchema = new mongoose.Schema({
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  jobInFold: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobsInfo',
    required: true
  },
  status: { 
    type: String,
    enum: ["applied", "readyForInterview", "rejected", "hired"],
    required: true,
    default: 'applied'
  },
  interviewDate: { type: Date },
  applicationDate: { 
    type: Date, 
    default: Date.now 
  },
  notes: { type: String }
}, { timestamps: true });

const myJob = mongoose.model('MyJob', myJobsSchema);

export default myJob;
