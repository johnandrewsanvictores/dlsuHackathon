import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";

import bcrypt from "bcrypt";
import { createToken } from "../utils/hash.js";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log(user);
        console.log(profile);
        console.log(process.env.NODE_ENV);

        if (!user) {
          user = await User.create({
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            password: null,
            email: profile._json.email, // Make sure 'email' scope is enabled!
            googleId: profile.id,
            username: generateUsername(profile._json.given_name),
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
export const google_authenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

export const google_callback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);

    req.logIn(user, (err) => {
      if (err) return next(err);

      console.log(req.user);

      const token = createToken(req.user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.redirect(`${process.env.FRONTEND_BASE_URL}/google-success`);
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : false,
      });

      // ✅ Just respond with JSON
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
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
