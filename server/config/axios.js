//request for external api
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const api = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true, // This is required for sending cookies
    headers: {
        'Content-Type': 'application/json' // ensure it's JSON
    }
});

export default api;
