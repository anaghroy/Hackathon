import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { intentAnalysis } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

/**
 * @description for user to analyze their project
 * @route POST /api/ai/intent/:projectId
 * @access Private
 */
aiRouter.post("/intent/:projectId", authUser, intentAnalysis);

export default aiRouter;
