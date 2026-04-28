import express from "express";
import { triggerDeployment, getLogs, rollbackDeployment, getDeploymentHistory, getDeploymentStatus } from "../controllers/deploy.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const deployRouter = express.Router();

/**
 * @desc Trigger a manual deployment for the specified project
 * @route POST /api/deploy/:projectId
 * @access Private
 */
deployRouter.post("/:projectId", authUser, triggerDeployment);

/**
 * @desc Get logs for the latest deployment of a project
 * @route GET /api/deploy/:projectId/logs
 * @access Private
 */
deployRouter.get("/:projectId/logs", authUser, getLogs);

/**
 * @desc Rollback to a previous deployment
 * @route POST /api/deploy/:projectId/rollback
 * @access Private
 */
deployRouter.post("/:projectId/rollback", authUser, rollbackDeployment);
deployRouter.get("/:projectId/history", authUser, getDeploymentHistory);
deployRouter.get("/:projectId/status", authUser, getDeploymentStatus);

export default deployRouter;
