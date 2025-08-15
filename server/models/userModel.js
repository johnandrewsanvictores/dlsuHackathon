import mongoose from 'mongoose';
import {Timestamp} from "mongodb";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    rememberToken: { type: String, required: false },
    isFirstVisit: {type: Boolean, default: true },
    userType: {type: String, default: null}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;