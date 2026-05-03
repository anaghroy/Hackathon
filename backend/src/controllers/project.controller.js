import mongoose from "mongoose";
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
      $or: [
        { "collaborators.user": req.user.id }, // Projects shared with me
        { 
          user: req.user.id, 
          collaborators: { $exists: true, $not: { $size: 0 } } 
        } // Projects shared by me (has at least one collaborator)
      ]
    })
    .populate("user", "username email picture")
    .populate("collaborators.user", "username email picture");

    res.status(200).json({ success: true, projects: sharedProjects });
  } catch (error) {
    console.error("Fetch Shared Projects Error:", error);
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid Project ID format: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid Project ID format" });
    }

    if (!email) {
      console.warn("AddCollaborator failed: Email is missing from request body");
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Verify ownership
    if (!project.user || project.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can add collaborators" });
    }

    // Find the user to add
    const collaboratorUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!collaboratorUser) {
      return res.status(404).json({ success: false, message: "User not found with this email. Make sure the user is registered." });
    }

    // Prevent adding oneself
    if (collaboratorUser._id.toString() === req.user.id) {
      console.warn(`AddCollaborator failed: User ${req.user.id} tried to add themselves`);
      return res.status(400).json({ success: false, message: "You cannot add yourself as a collaborator" });
    }

    // Check if already a collaborator
    const isAlreadyCollaborator = project.collaborators && project.collaborators.some(
      (c) => c.user && c.user.toString() === collaboratorUser._id.toString()
    );

    if (isAlreadyCollaborator) {
      console.warn(`AddCollaborator failed: User ${collaboratorUser.email} is already a collaborator on project ${id}`);
      return res.status(400).json({ success: false, message: "User is already a collaborator" });
    }

    // Validate role against enum
    const validRoles = ["viewer", "editor", "admin"];
    const assignedRole = (role || "viewer").toLowerCase();
    if (!validRoles.includes(assignedRole)) {
      console.warn(`AddCollaborator failed: Invalid role '${role}' specified`);
      return res.status(400).json({ success: false, message: `Invalid role: ${role}. Valid roles are viewer, editor, admin.` });
    }

    // Add collaborator
    if (!project.collaborators) project.collaborators = [];
    project.collaborators.push({
      user: collaboratorUser._id,
      role: assignedRole
    });

    await project.save();

    res.status(200).json({ 
      success: true, 
      message: "Collaborator added successfully", 
      project 
    });
  } catch (error) {
    console.error("Add Collaborator Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding collaborator", 
      error: error.message 
    });
  }
};

/**
 * @desc Invite collaborator to multiple projects
 * @route POST /api/projects/bulk-invite
 * @access Private
 * @body { email, projectIds, role }
 */
export const inviteToMultipleProjects = async (req, res) => {
  try {
    const { email, projectIds, role } = req.body;

    if (!email || !projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and at least one project ID are required" 
      });
    }

    // Find the user to add
    const collaboratorUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!collaboratorUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found with this email. Make sure the user is registered." 
      });
    }

    // Prevent adding oneself
    if (collaboratorUser._id.toString() === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot add yourself as a collaborator" 
      });
    }

    const validRoles = ["viewer", "editor", "admin"];
    const assignedRole = (role || "viewer").toLowerCase();
    if (!validRoles.includes(assignedRole)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role specified" 
      });
    }

    const results = [];
    
    // Process each project
    for (const projectId of projectIds) {
      try {
        const project = await Project.findById(projectId);
        
        if (!project) {
          results.push({ id: projectId, status: "failed", message: "Project not found" });
          continue;
        }

        // Verify ownership
        if (!project.user || project.user.toString() !== req.user.id) {
          results.push({ id: projectId, title: project.title, status: "failed", message: "Only owner can invite" });
          continue;
        }

        // Check if already a collaborator
        const isAlready = project.collaborators && project.collaborators.some(
          (c) => c.user && c.user.toString() === collaboratorUser._id.toString()
        );

        if (isAlready) {
          results.push({ id: projectId, title: project.title, status: "skipped", message: "Already a collaborator" });
          continue;
        }

        // Add collaborator
        if (!project.collaborators) project.collaborators = [];
        project.collaborators.push({
          user: collaboratorUser._id,
          role: assignedRole
        });

        await project.save();
        results.push({ id: projectId, title: project.title, status: "success" });
      } catch (err) {
        results.push({ id: projectId, status: "failed", message: err.message });
      }
    }

    res.status(200).json({ 
      success: true, 
      message: "Bulk invitation process completed", 
      results 
    });
  } catch (error) {
    console.error("Bulk Invite Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during bulk invitation", 
      error: error.message 
    });
  }
};

/**
 * @desc Get unique collaborators from all user's projects
 * @route GET /api/projects/collaborators/recent
 * @access Private
 */
export const getRecentCollaborators = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).populate("collaborators.user", "email username picture");
    
    const collaboratorMap = new Map();
    
    projects.forEach(project => {
      if (project.collaborators) {
        project.collaborators.forEach(collab => {
          if (collab.user && collab.user.email) {
            collaboratorMap.set(collab.user.email, {
              email: collab.user.email,
              username: collab.user.username,
              picture: collab.user.picture
            });
          }
        });
      }
    });

    const recentCollaborators = Array.from(collaboratorMap.values());

    res.status(200).json({
      success: true,
      collaborators: recentCollaborators
    });
  } catch (error) {
    console.error("Get Recent Collaborators Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent collaborators",
      error: error.message
    });
  }
};
