import mongoose from 'mongoose';

const myJobsSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobInFold: { type: String },
  status: { 
    type: String,
    enum: ["applied", "readyToInterview", "rejected", "hired"],
    required: true
  },
  interviewDate: { type: Date, required: true }
}, { timestamps: true });

const MyJob = mongoose.model('MyJob', myJobsSchema);

export default MyJob;
