import {
  createMemory,
  getProjectMemories,
  getFileMemories,
} from "../services/memory.service.js";
import { deleteCache, buildExplainKey } from "../services/cache.service.js";

// CREATE MEMORY
export const addMemory = async (req, res) => {
  try {
    const {projectId} = req.params;
    
    const memory = await createMemory({
      ...req.body,
      projectId,
      createdBy: req.user._id,
    });

    await deleteCache(buildExplainKey(projectId));

    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PROJECT MEMORY
export const getMemories = async (req, res) => {
  try {
    const memories = await getProjectMemories(req.params.projectId);
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET FILE SPECIFIC MEMORY
export const getFileMemory = async (req, res) => {
  try {
    const { projectId, filePath } = req.params;

    const memories = await getFileMemories(projectId, filePath);

    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};