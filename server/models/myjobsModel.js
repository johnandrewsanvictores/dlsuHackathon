import mongoose from 'mongoose';

const myJobsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobInfoId: { type: mongoose.Schema.Types.ObjectId},
  applicationStatus: { 
    type: String,
    enum: ["applied", "readyToInterview", "rejected", "hired"],
    required: true,
    default: "applied"
  },
  interviewDate: { type: Date}
}, { timestamps: true });

const myJob = mongoose.model('MyJob', myJobsSchema);

export default myJob;
