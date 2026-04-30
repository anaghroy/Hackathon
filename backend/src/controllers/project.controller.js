import Project from "../models/project.model.js";
import User from "../models/user.model.js";

/**
 * @desc Create a new project
 * @route POST /api/projects
 * @access Private
 * @body { title, description }
 */
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }

    const project = await Project.create({
      user: req.user.id,
      title,
      description,
    });

    return res.status(201).json({
      message: "Project created successfully",
      success: true,
      project: {
        ...project.toObject(),
        id: project._id,
      },
    });
  } catch (error) {
    console.error("Project Creation Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Get all projects
 * @route GET /api/projects
 * @access Private
 * @returns
 */
export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId });

    return res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Project Fetching Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Get single project
 * @route GET /api/projects/:id
 * @access Private
 * @returns
 */
export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    return res.status(200).json({
      message: "Project fetched successfully",
      success: true,
      project,
    });
  } catch (error) {
    console.error("Project Fetching Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Update project
 * @route PUT /api/projects/:id
 * @access Private
 * @body { title, description }
 * @returns
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, files } = req.body;

    // Only update fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (files !== undefined) updateData.files = files;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Project updated successfully",
      success: true,
      project,
    });
  } catch (error) {
    console.error("Project Updating Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Delete project
 * @route DELETE /api/projects/:id
 * @access Private
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Project deleted successfully",
      success: true,
      project,
    });
  } catch (error) {
    console.error("Project Deleting Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Get shared projects
 * @route GET /api/projects/shared
 * @access Private
 */
export const getSharedProjects = async (req, res) => {
  try {
    const sharedProjects = await Project.find({
      "collaborators.user": req.user.id,
    }).populate("user", "username email picture"); // Populate owner details to show on frontend

    res.status(200).json({ success: true, projects: sharedProjects });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching shared projects" });
  }
};

/**
 * @desc Add collaborator
 * @route POST /api/projects/:id/collaborators
 * @access Private
 * @body { email, role }
 */
export const addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Verify ownership
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can add collaborators" });
    }

    // Find the user to add
    const collaboratorUser = await User.findOne({ email: email.toLowerCase() });
    if (!collaboratorUser) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // Prevent adding oneself
    if (collaboratorUser._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot add yourself as a collaborator" });
    }

    // Check if already a collaborator
    const isAlreadyCollaborator = project.collaborators.some(
      (c) => c.user.toString() === collaboratorUser._id.toString()
    );

    if (isAlreadyCollaborator) {
      return res.status(400).json({ success: false, message: "User is already a collaborator" });
    }

    // Add collaborator
    project.collaborators.push({
      user: collaboratorUser._id,
      role: role || "viewer"
    });

    await project.save();

    res.status(200).json({ success: true, message: "Collaborator added successfully", project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding collaborator", error: error.message });
  }
};
