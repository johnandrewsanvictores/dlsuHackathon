import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './controllers/authController.js';

import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import resumeRoutes from './routes/resumeRoute.js';
import jobInfoRoutes from  './routes/jobInfoRoute.js';
import manageJobsRoutes from './routes/manageJobsRoute.js';
import adminRoutes from './routes/adminRoute.js';
import connectDbB from './config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import {scrapeOnlineJobs} from "./scraper-onlinejobs.js";
import jobsInfo from "./models/jobsInfoModel.js";
import jobInfoRoute from "./routes/jobInfoRoute.js";

dotenv.config();
const app = express();

// Connect to DB
connectDbB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [
        process.env.FRONTEND_BASE_URL,
        'https://accounts.google.com'
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, 'uploads') });




const jobs = [
];

// Insert all 50 jobs
// jobsInfo.insertMany(jobs)
//     .then(() => {
//         console.log("50 unique IT job posts inserted successfully!");
//         mongoose.connection.close();
//     })
//     .catch((err) => {
//         console.error(err);
//         mongoose.connection.close();
//     });

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/resume', resumeRoutes);
app.use('/jobs', jobInfoRoutes);
app.use('/jobs', manageJobsRoutes);
app.use('/dashboard', manageJobsRoutes);
app.use('/admin', adminRoutes);




// Start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
