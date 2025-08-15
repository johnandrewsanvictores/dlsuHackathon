import User from "../models/userModel.js";
import dotenv from 'dotenv';
import {createToken, hashPassword} from "../utils/hash.js";

dotenv.config();

export const getUser = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json(req.user);            // whatever you stored in deserializeUser
    }
    res.status(401).json({ message: 'Not authenticated' });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // exclude password

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: { ...user.toObject(), userId: user._id } });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const createUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password, username} = req.body;

        const hashedPassword = await hashPassword(password);

        const users = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        })

        if (users) {
            if (users.email === email) {
                return res.status(409).json({ error: "Email already exists" });
            }
            if (users.username === username) {
                return res.status(409).json({ error: "Username already exists" });
            }
        }

        const user = await User.create({firstName, lastName,email, password: hashedPassword, username});
        const token = createToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only on HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            user: {
                userId : user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
            },
            success: "true",
            message: "User created successfully"
        });
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
