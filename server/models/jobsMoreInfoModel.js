import mongoose from 'mongoose';
import {Timestamp} from "mongodb";

const userSchema = new mongoose.Schema({
    jobInfold: { type: Object},
    sourceSite: { type: String},
    originalJobId: { type: String},
    sourceUrl: { type: String}
});

const User = mongoose.model('User', userSchema);

export default User;