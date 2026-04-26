import DecisionMemory from "../models/decisionMemory.model.js";

export const createMemory = async (data) => {
  return await DecisionMemory.create(data);
};

export const getProjectMemories = async (projectId) => {
  return await DecisionMemory.find({ projectId }).sort({ createdAt: -1 });
};

export const getFileMemories = async (projectId, filePath) => {
  return await DecisionMemory.find({ projectId, filePath });
};