import Project from "../models/project.model.js";

/**
 * @desc Connect a repository and initialize a new project
 * @route POST /api/repos/connect
 * @access Private
 * @body { provider, repoName, branch, buildCommand }
 */
export const connectRepo = async (req, res) => {
  try {
    const { provider, repoName, branch, buildCommand } = req.body;

    if (!provider || !repoName) {
      return res.status(400).json({
        success: false,
        message: "Provider and repoName are required.",
      });
    }

    // Initialize a new project record in the database for the repo
    const newProject = await Project.create({
      title: repoName,
      user: req.user._id, // Assuming auth middleware attaches user
      repoProvider: provider,
      repoName: repoName,
      branch: branch || "main",
      buildCommand: buildCommand || "",
      description: `Connected ${provider} repository: ${repoName}`,
    });

    // Dummy logic to represent setting up webhooks
    console.log(`[DevOps] Setting up webhook for ${provider} repo: ${repoName}`);

    return res.status(201).json({
      success: true,
      message: "Repository connected and project initialized successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error in connectRepo:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while connecting repository.",
    });
  }
};
