import axios from "axios";

const deployApi = axios.create({
  baseURL: "/api/deploy",
  withCredentials: true,
});

export const triggerDeployApi = (projectId, data) => {
  return deployApi.post(`/${projectId}`, data);
};

export const getDeployStatusApi = (projectId) => {
  return deployApi.get(`/${projectId}/status`);
};

export const getDeployHistoryApi = (projectId) => {
  return deployApi.get(`/${projectId}/history`);
};

export const getDeployLogsApi = (projectId, params) => {
  return deployApi.get(`/${projectId}/logs`, { params });
};

export const rollbackDeployApi = (projectId, targetDeploymentId) => {
  return deployApi.post(`/${projectId}/rollback`, { targetDeploymentId });
};

export default deployApi;
