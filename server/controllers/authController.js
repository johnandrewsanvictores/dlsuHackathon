import dotenv from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/hash.js";

dotenv.config();

export const logout = (_req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 1. Find user by username
    const user = await User.findOne({ username });
    if (!user || !user.password) {
      // user may not exist or was created via OAuth without password
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Create token
    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only on HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 4. Send token and user info (without password)
    res.status(200).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        userType: user.userType,
        isFirstVisit: user.isFirstVisit,
      },
    });
  } catch (err) {
    console.error("Sign in error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id, ...updateFields } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Updated user successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
