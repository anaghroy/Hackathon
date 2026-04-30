import Project from "../models/project.model.js";
import Deployment from "../models/deployment.model.js";
import { analyzeCodeSecurity } from "../services/ai.service.js";

/**
 * @desc Trigger a manual deployment
 * @route POST /api/deploy/:projectId
 * @access Private
 * @body { commitHash } (optional)
 */
export const triggerDeployment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { commitHash = "latest" } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // 1. Create a new deployment record in the database
    const deployment = await Deployment.create({
      project: projectId,
      status: "QUEUED",
      commitHash,
      logs: [
        {
          message: "Deployment triggered successfully.",
          type: "system",
        },
      ],
    });

    // 2. Simulate the DevOps actions asynchronously
    // In a real application, this would trigger a job queue or an external CI/CD tool
    simulateDeploymentProcess(deployment._id, project);

    return res.status(202).json({
      success: true,
      message: "Deployment triggered and queued.",
      deployment,
    });
  } catch (error) {
    console.error("Error triggering deployment:", error);
    return res.status(500).json({ success: false, message: "Server error triggering deployment" });
  }
};

/**
 * Dummy function to simulate a deployment pipeline
 * @param {ObjectId} deploymentId 
 * @param {Object} project 
 */
async function simulateDeploymentProcess(deploymentId, project) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Pre-Deployment Phase: Security Scanning
    await Deployment.findByIdAndUpdate(deploymentId, {
      $push: { logs: { message: `Running AI Security Scan...`, type: "system" } }
    });
    
    const securityResult = await analyzeCodeSecurity(project._id, project.files || []);
    
    if (securityResult.highRiskIssues > 0) {
      await Deployment.findByIdAndUpdate(deploymentId, {
        status: "FAILED",
        $push: { logs: { message: `[SYSTEM] Deployment halted due to ${securityResult.highRiskIssues} critical security vulnerabilities.`, type: "stderr" } }
      });
      return; // Stop deployment
    }

    // Stage 1: BUILDING
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "BUILDING",
      $push: { logs: { message: `Security scan passed. Cloning repository ${project.repoName}...`, type: "stdout" } }
    });
    await wait(2000);
    
    await Deployment.findByIdAndUpdate(deploymentId, {
      $push: { logs: { message: `Installing dependencies...`, type: "stdout" } }
    });
    await wait(2000);
    
    await Deployment.findByIdAndUpdate(deploymentId, {
      $push: { logs: { message: `Running build command: ${project.buildCommand || "npm run build"}`, type: "stdout" } }
    });
    await wait(3000);

    // Stage 2: DEPLOYING
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "DEPLOYING",
      $push: { logs: { message: `Build successful. Spinning up container...`, type: "system" } }
    });
    await wait(2000);

    // Stage 3: SUCCESS
    const simulatedUrl = `https://${project.repoName.split('/')[1] || 'app'}.cognicode.dev`;
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "SUCCESS",
      url: simulatedUrl,
      $push: { logs: { message: `Container started. Deployment live at ${simulatedUrl}`, type: "system" } }
    });

  } catch (error) {
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "FAILED",
      $push: { logs: { message: `Deployment failed: ${error.message}`, type: "stderr" } }
    });
  }
}

/**
 * @desc Get logs for the latest deployment of a project
 * @route GET /api/deploy/:projectId/logs
 * @access Private
 * @query { type, lines }
 */
export const getLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type = "build", lines = 100 } = req.query;

    // Find the most recent deployment for this project
    const latestDeployment = await Deployment.findOne({ project: projectId }).sort({ createdAt: -1 });

    if (!latestDeployment) {
      return res.status(200).json({ 
        success: true, 
        message: "No deployments found for this project yet.",
        deploymentId: null,
        status: "NONE",
        logs: []
      });
    }

    // Filter logs if needed (dummy filtering logic based on type could be added)
    // For now, return the last 'n' lines
    const logLines = latestDeployment.logs.slice(-parseInt(lines));

    return res.status(200).json({
      success: true,
      deploymentId: latestDeployment._id,
      status: latestDeployment.status,
      logs: logLines,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).json({ success: false, message: "Server error fetching logs." });
  }
};

/**
 * @desc Rollback to a previous deployment
 * @route POST /api/deploy/:projectId/rollback
 * @access Private
 * @body { targetDeploymentId }
 */
export const rollbackDeployment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { targetDeploymentId } = req.body;

    if (!targetDeploymentId) {
      return res.status(400).json({ success: false, message: "targetDeploymentId is required for rollback." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const targetDeployment = await Deployment.findById(targetDeploymentId);
    if (!targetDeployment || targetDeployment.project.toString() !== projectId) {
      return res.status(404).json({ success: false, message: "Target deployment not found or does not belong to this project." });
    }

    if (targetDeployment.status !== "SUCCESS") {
      return res.status(400).json({ success: false, message: "Can only rollback to a successful deployment." });
    }

    // Simulate rollback by creating a new deployment record representing the rollback
    const rollbackDeploymentRecord = await Deployment.create({
      project: projectId,
      status: "QUEUED",
      commitHash: targetDeployment.commitHash, // Restoring to the old commit
      logs: [
        {
          message: `Rollback triggered to deployment ${targetDeploymentId} (Commit: ${targetDeployment.commitHash}).`,
          type: "system",
        },
      ],
    });

    // Simulate the rollback process asynchronously
    simulateDeploymentProcess(rollbackDeploymentRecord._id, project);

    return res.status(202).json({
      success: true,
      message: "Rollback initiated.",
      deploymentId: rollbackDeploymentRecord._id,
      status: rollbackDeploymentRecord.status,
    });
  } catch (error) {
    console.error("Error triggering rollback:", error);
    return res.status(500).json({ success: false, message: "Server error triggering rollback." });
  }
};

/**
 * @desc Get all deployments for a project
 * @route GET /api/deploy/:projectId/history
 * @access Private
 */
export const getDeploymentHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const history = await Deployment.find({ project: projectId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({ success: false, message: "Server error fetching history." });
  }
};

/**
 * @desc Get status of the latest deployment
 * @route GET /api/deploy/:projectId/status
 * @access Private
 */
export const getDeploymentStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const deployment = await Deployment.findOne({ project: projectId }).sort({ createdAt: -1 });
    if (!deployment) {
      return res.status(200).json({ success: true, deployment: null });
    }
    return res.status(200).json({ success: true, deployment });
  } catch (error) {
    console.error("Error fetching status:", error);
    return res.status(500).json({ success: false, message: "Server error fetching status." });
  }
};
