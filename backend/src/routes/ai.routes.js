import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  intentAnalysis,
  explainCodebase,
  explainGraphWithAI,
  reviewCode,
  generateTests,
  generateSchema,
  debugCode,
  securityScan,
} from "../controllers/ai.controller.js";

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

/**
 * @description Review code snippet based on team conventions (Decision Memory)
 * @route POST /api/ai/review/:projectId
 * @access Private
 */
aiRouter.post("/review/:projectId", authUser, reviewCode);

/**
 * @description Generate unit tests for a code snippet
 * @route POST /api/ai/test/:projectId
 * @access Private
 */
aiRouter.post("/test/:projectId", authUser, generateTests);

/**
 * @description Generate DB schema and ER diagram from natural language
 * @route POST /api/ai/schema/:projectId
 * @access Private
 */
aiRouter.post("/schema/:projectId", authUser, generateSchema);

/**
 * @description Time-Travel Debugging & Root Cause Analyzer
 * @route POST /api/ai/debug/:projectId
 * @access Private
 */
aiRouter.post("/debug/:projectId", authUser, debugCode);

/**
 * @description Context-Aware Security & Vulnerability Auto-Fixer
 * @route POST /api/ai/security/:projectId
 * @access Private
 */
aiRouter.post("/security/:projectId", authUser, securityScan);

export default aiRouter;
