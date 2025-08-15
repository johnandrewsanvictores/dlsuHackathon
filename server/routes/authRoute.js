import express from "express";

import { logout, signIn, updateUser } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/logout", logout);
router.post("/signin", signIn);
router.put("/updateUser", updateUser);

router.get("/user/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: { ...user.toObject(), userId: user._id } });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
