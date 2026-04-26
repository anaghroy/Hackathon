import Project from "../models/project.model.js";
import { deleteCache, buildExplainKey } from "../services/cache.service.js";

export const uploadProjectFiles = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    console.log("buildExplainKey:", buildExplainKey);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file, index) => ({
      filename: req.body.filePaths[index],
      content: file.buffer.toString("utf-8"),
    }));

    await Project.findByIdAndUpdate(projectId, {
      $push: { files: { $each: files } },
    });

        await deleteCache(buildExplainKey(projectId));

    console.log("📂 Files updated → cache cleared");
    res.json({
      message: "Files uploaded successfully",
      count: files.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
