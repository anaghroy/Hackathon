import { Router } from "express";
import passport from "../config/passport.js";
import {
  register,
  verifyEmail,
  login,
  getMe,
  logout,
  resendVerificationEmail,
  googleCallback,
  githubCallback,
  updateProfile,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
} from "../utils/rateLimiter.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */

authRouter.post(
  "/register",
  registerValidator,
  rateLimitMiddleware(
    registerLimiter,
    (req) => `${req.body.email || req.ip}_${req.ip}`,
  ),
  register,
);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);
/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend verification email
 * @access Public
 * @body { email }
 */
authRouter.post("/resend-verification", resendVerificationEmail);

/**
 * @route GET /api/auth/google
 * @desc Google authentication
 * @access Public
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback,
);

authRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=github_failed",
  }),
  githubCallback,
);

/**
 * @route PUT /api/auth/update-profile
 * @desc Update user's profile
 * @access Private
 * @body { username, bio, dob }
 */
authRouter.put(
  "/update-profile",
  authUser,
  updateProfileValidator,
  updateProfile,
);

/**
 * @route POST /api/auth/upload-profile-picture
 * @desc Upload user's profile picture
 * @access Private
 * @body { image }
 */
authRouter.post(
  "/upload-profile-picture",
  authUser,
  upload.single("image"), // field name must match frontend
  uploadProfilePicture,
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Forgot password
 * @access Public
 * @body { email }
 */
authRouter.post(
  "/forgot-password",
  rateLimitMiddleware(
    forgotPasswordLimiter,
    (req) => `forgot:${req.body.email || req.body.identifier || "unknown"}:${req.ip}`,
  ),
  forgotPassword,
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password
 * @access Public
 * @body { password }
 */
authRouter.post("/reset-password", resetPasswordValidator, resetPassword);
/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */

authRouter.post("/logout", logout);

export default authRouter;
