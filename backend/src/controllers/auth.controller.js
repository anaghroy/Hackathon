import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import { config } from "../config/config.js";
import { redisClient } from "../config/redis.js";
import { imagekit } from "../services/image.service.js";
import { resetPasswordTemplate } from "../emails/resetPassword.template.js";
import { loginLimiter } from "../utils/rateLimiter.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        err: "User already exists",
      });
    }

    const user = await userModel.create({ username, email, password });

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      config.JWT_SECRET,
    );

    const backendUrl = config.FRONTEND_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "Welcome to Perplexity!",
      html: `
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>The Perplexity Team</p>
      `,
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Registration failed. Please try again.",
      success: false,
      err: error.message,
    });
  }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { identifier, password } = req.body;
  const key = `${identifier}_${req.ip}`;
  try {
    const rateState = await loginLimiter.get(key);

    if (rateState && rateState.remainingPoints <= 0) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: Math.round(rateState.msBeforeNext / 1000) || 1,
      });
    }

    // identifier = username OR email
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid username/email or password",
        success: false,
      });
    }

    // Prevent OAuth users from logging in via password
    if (user.provider !== "local") {
      return res.status(400).json({
        message: "Please login using Google or GitHub",
        success: false,
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      const consumed = await loginLimiter.consume(key);
      console.log("RATE STATE AFTER FAIL:", consumed);

      return res.status(400).json({
        message: "Invalid username/email or password",
        success: false,
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }
    await loginLimiter.delete(key);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (!(error instanceof Error) && error?.msBeforeNext) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: Math.round(error.msBeforeNext / 1000) || 1,
      });
    }
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;
  const frontendUrl = config.FRONTEND_URL + "/login" || "http://localhost:5173/login";

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.redirect(
        `${frontendUrl}/verify-email?status=error&message=UserNotFound`,
      );
    }

    // Mark verified (only if not already)
    if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    // CREATE JWT
    const authToken = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: "3d" },
    );

    // SET COOKIE
    res.cookie("token", authToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend success page
    return res.redirect(`${frontendUrl}`);
  } catch (err) {
    return res.redirect(
      `${frontendUrl}/verify-email?status=error&message=InvalidToken`,
    );
  }
}

/**
 * @desc Logout user and clear JWT cookie
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (decoded && decoded.exp) {
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await redisClient.setEx(`blacklist:${token}`, expiresIn, "blacklisted");
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification
 * @access Public
 * @body { email }
 */
export async function resendVerificationEmail(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      success: false,
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      config.JWT_SECRET,
    );

    const backendUrl = config.FRONTEND_URL || "http://localhost:3000";

    await sendEmail({
      to: email,
      subject: "Verify your Perplexity account!",
      html: `
        <p>Hi ${user.username},</p>
        <p>You requested to resend the verification email. Please verify your email address by clicking the link below:</p>
        <a href="${backendUrl}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>The Perplexity Team</p>
      `,
    });

    return res.status(200).json({
      message: "Verification email resent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Failed to resend verification email",
      success: false,
      err: error.message,
    });
  }
}

export async function googleCallback(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: "3d" },
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend (change URL accordingly)
    return res.redirect(`${config.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const githubCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "GitHub authentication failed" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: "3d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${config.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files allowed" });
    }

    const result = await imagekit.upload({
      file: req.file.buffer, // file buffer
      fileName: `user_${Date.now()}`,
      folder: "Hackathon/profile_pictures",
    });

    const user = await userModel.findById(req.user.id);

    user.picture = result.url; // store URL
    await user.save();

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: result.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { username, city, bio, dob } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Username update (with uniqueness check)
    if (username && username !== user.username) {
      const normalized = username.toLowerCase();

      const existing = await userModel.findOne({ username: normalized });

      if (existing) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }

      user.username = username.toLowerCase();
    }

    // Optional updates
    if (city !== undefined) user.city = city;
    if (bio !== undefined) user.bio = bio;
    if (dob !== undefined) user.dob = dob;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        city: user.city,
        bio: user.bio,
        dob: user.dob,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email || req.body.identifier;
    console.log("FORGOT PASSWORD EMAIL:", email);

    const user = await userModel.findOne({ email });
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = resetPasswordTemplate(resetUrl, user.username);

    const info = await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    console.log("EMAIL SENT INFO:", info);

    return res.status(200).json({
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Prevent OAuth users misuse
    if (user.provider !== "local") {
      return res.status(400).json({
        message: "Password reset not allowed for OAuth users",
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    user.passwordChangedAt = Date.now();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};
