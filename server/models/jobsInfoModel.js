import mongoose from 'mongoose';

const myJobsSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String },
  workArrangement: { 
    type: String, 
    enum: ["onSite", "hybrid", "remote", "flexTime"], 
    required: true 
  },
  employmentType: { 
    type: String, 
    enum: ["partTime", "fullTime", "contract", "selfEmployed", "internship"] 
  },
  postedDate: { type: Date }, 
  shortDescription: { type: String },
  applicationLink: { type: String },
  salaryRange: { 
    minimum: { type: Number },
    maximum: { type: Number }
  },
  industry: { type: String },
  experienceLevel: { type: String },
});

const MyJob = mongoose.model('MyJob', myJobsSchema);

export default MyJob;
