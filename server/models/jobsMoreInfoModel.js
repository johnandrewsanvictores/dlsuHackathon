import mongoose from 'mongoose';

const jobsMoreInfoSchema = new mongoose.Schema({
    jobInfold: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobsInfo',
        required: true
    },
    sourceSite: { 
        type: String,
        required: true,
        default: 'manual'
    },
    originalJobId: { type: String },
    sourceUrl: { type: String }
}, { timestamps: true });

const jobsMoreInfo = mongoose.model('jobsMoreInfo', jobsMoreInfoSchema);

export default jobsMoreInfo;