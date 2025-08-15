import User from "../models/userModel.js";
import dotenv from "dotenv";
import { createToken, hashPassword } from "../utils/hash.js";

dotenv.config();

export const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user); // whatever you stored in deserializeUser
  }
  res.status(401).json({ message: "Not authenticated" });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password -rememberToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting user profile:", err);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    const hashedPassword = await hashPassword(password);

    const users = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (users) {
      if (users.email === email) {
        return res.status(409).json({ error: "Email already exists" });
      }
      if (users.username === username) {
        return res.status(409).json({ error: "Username already exists" });
      }
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username,
    });
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only on HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
      success: "true",
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email, username } = req.body;

    // Check if username or email already exists (exclude current user)
    const existingUser = await User.findOne({
      $and: [{ _id: { $ne: userId } }, { $or: [{ email }, { username }] }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ error: "Username already exists" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, username },
      { new: true, select: "-password -rememberToken" }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};
