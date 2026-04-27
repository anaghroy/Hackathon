import axios from "axios";

const aiApi = axios.create({
  baseURL: "/api/ai",
  withCredentials: true,
  timeout: 30000, // AI requests might take longer
});

// Feature 1: Intent Mode
export const intentApi = (projectId, data) => {
  return aiApi.post(`/intent/${projectId}`, data);
};

// Feature 2: Architecture Graph (Explain AI)
export const explainAiApi = (projectId) => {
  return aiApi.get(`/explain-ai/${projectId}`);
};

// Feature 3: Raw Graph (Optional)
export const explainRawApi = (projectId) => {
  return aiApi.get(`/explain/${projectId}`);
};

// Feature 4: DB Schema Generator
export const generateSchemaApi = (projectId, data) => {
  return aiApi.post(`/schema/${projectId}`, data);
};

// Feature 6: Generate Tests
export const generateTestsApi = (projectId, data) => {
  return aiApi.post(`/test/${projectId}`, data);
};

// Feature 7: Code Review
export const reviewCodeApi = (projectId, data) => {
  return aiApi.post(`/review/${projectId}`, data);
};

export default aiApi;
