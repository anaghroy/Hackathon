import express from "express";
import { connectRepo, getRepos } from "../controllers/repo.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const repoRouter = express.Router();

/**
 * @desc Get list of repositories
 * @route GET /api/repos/:provider/list
 * @access Private
 */
repoRouter.get("/:provider/list", authUser, getRepos);

/**
 * @desc Connect a repository
 * @route POST /api/repos/connect
 * @access Private
 */
repoRouter.post("/connect", authUser, connectRepo);

export default repoRouter;
