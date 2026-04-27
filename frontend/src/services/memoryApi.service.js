import axios from "axios";

const memoryApi = axios.create({
  baseURL: "/api/memory",
  withCredentials: true,
  timeout: 10000,
});

// Feature 5: Get Memory
export const getMemoryApi = (projectId) => {
  return memoryApi.get(`/${projectId}`);
};

// Feature 5: Post Memory (If needed)
export const addMemoryApi = (projectId, data) => {
  return memoryApi.post(`/${projectId}`, data);
};

export default memoryApi;
