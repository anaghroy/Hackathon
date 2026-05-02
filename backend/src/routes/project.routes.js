import express from "express";
const projectRouter = express.Router();
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getSharedProjects,
  addCollaborator,
  inviteToMultipleProjects,
  getRecentCollaborators,
} from "../controllers/project.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

/**
 * @desc Create a new project
 * @route POST /api/projects/create
 * @access Private
 * @body { title, description }
 */
projectRouter.post("/create", authUser, createProject);
/**
 * @desc Get all projects
 * @route GET /api/projects/
 * @access Private
 */
projectRouter.get("/", authUser, getProjects);
/**
 * @desc Get shared projects
 * @route GET /api/projects/shared
 * @access Private
 */
projectRouter.get("/shared", authUser, getSharedProjects);

/**
 * @desc Get single project
 * @route GET /api/projects/:id
 * @access Private
 */
projectRouter.get("/:id", authUser, getSingleProject);
/**
 * @desc Update project
 * @route PUT /api/projects/:id
 * @access Private
 * @body { title, description }
 */
projectRouter.put("/:id", authUser, updateProject);
/**
 * @desc Delete project
 * @route DELETE /api/projects/:id
 * @access Private
 */
projectRouter.delete("/:id", authUser, deleteProject);
/**
 * @desc Add collaborator
 * @route POST /api/projects/:id/collaborators
 * @access Private
 * @body { email, role }
 */
projectRouter.post("/:id/collaborators", authUser, addCollaborator);
/**
 * @desc Invite collaborator to multiple projects
 * @route POST /api/projects/bulk-invite
 * @access Private
 */
projectRouter.post("/bulk-invite", authUser, inviteToMultipleProjects);
/**
 * @desc Get recent collaborators
 * @route GET /api/projects/collaborators/recent
 * @access Private
 */
projectRouter.get("/collaborators/recent", authUser, getRecentCollaborators);

export default projectRouter;
