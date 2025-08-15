import mongoose from 'mongoose';
import {Timestamp} from "mongodb";

const jobsMoreInfoSchema = new mongoose.Schema({
    jobInfold: { type: mongoose.Schema.Types.ObjectId},
    sourceSite: { type: String},
    originalJobId: { type: String},
    sourceUrl: { type: String}
});

const jobsMoreInfo = mongoose.model('User', jobsMoreInfoSchema);

export default jobsMoreInfo;