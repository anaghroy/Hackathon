import express from "express";
import { getEnvironmentVariables, updateEnvironmentVariables } from "../controllers/env.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const envRouter = express.Router();

/**
 * @desc Retrieve environment variables for a project
 * @route GET /api/env/:projectId
 * @access Private
 */
envRouter.get("/:projectId", authUser, getEnvironmentVariables);

/**
 * @desc Update environment variables for a project
 * @route POST /api/env/:projectId
 * @access Private
 */
envRouter.post("/:projectId", authUser, updateEnvironmentVariables);

export default envRouter;
