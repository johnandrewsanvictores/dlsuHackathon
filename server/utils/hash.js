import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();
export const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export function generateUsername(givenName) {
    const name = givenName.toLowerCase().replace(/\s+/g, ''); // lowercase + no spaces
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `${name}${randomNum}`;
}

//user
export const createToken = (userId) => {
    return jwt.sign({ userId },  process.env.JWT_SECRET, { expiresIn: '7d'});
}