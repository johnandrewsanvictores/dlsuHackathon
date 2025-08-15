import mongoose from 'mongoose';

const myJobsSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobInFold: { type: mongoose.Schema.Types.ObjectId},
  status: { 
    type: String,
    enum: ["applied", "readyToInterview", "rejected", "hired"],
    required: true
  },
  interviewDate: { type: Date}
}, { timestamps: true });

const myJob = mongoose.model('MyJob', myJobsSchema);

export default myJob;
