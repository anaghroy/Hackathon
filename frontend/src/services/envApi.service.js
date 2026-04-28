import axios from "axios";

const envApi = axios.create({
  baseURL: "/api/env",
  withCredentials: true,
});

export const getEnvVarsApi = (projectId) => {
  return envApi.get(`/${projectId}`);
};

export const updateEnvVarsApi = (projectId, variables) => {
  return envApi.post(`/${projectId}`, { variables });
};

export default envApi;
