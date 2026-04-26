import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { intentAnalysis } from "../controllers/ai.controller.js";
import { explainCodebase } from "../controllers/ai.controller.js";
import { explainGraphWithAI } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

/**
 * @description for user to analyze their project
 * @route POST /api/ai/intent/:projectId
 * @access Private
 */
aiRouter.post("/intent/:projectId", authUser, intentAnalysis);

/**
 * @description for user to explain their project
 * @route GET /api/ai/explain/:projectId
 * @access Private
 */
aiRouter.get("/explain/:projectId", authUser, explainCodebase);

/**
 * @description Explain codebase graph with AI
 * @route GET /api/ai/explain-ai/:projectId
 * @access Private
 */
aiRouter.get("/explain-ai/:projectId", authUser, explainGraphWithAI);

export default aiRouter;
