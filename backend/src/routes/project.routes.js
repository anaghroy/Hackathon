import express from "express";
const projectRouter = express.Router();
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
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

export default projectRouter;
