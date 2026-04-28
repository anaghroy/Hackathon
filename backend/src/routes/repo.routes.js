import express from "express";
import { connectRepo } from "../controllers/repo.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const repoRouter = express.Router();

/**
 * @desc Connect a repository
 * @route POST /api/repos/connect
 * @access Private
 */
repoRouter.post("/connect", authUser, connectRepo);

export default repoRouter;
