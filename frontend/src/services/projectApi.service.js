
import axios from "axios";

const projectApi = axios.create({
  baseURL: "/api/projects",
  withCredentials: true,
  timeout: 10000,
});

// Create Project
export const createProjectApi = (data) => {
  return projectApi.post("/create", data);
};

// Get All Projects
export const getProjectsApi = () => {
  return projectApi.get("/");
};

// Get Single Project
export const getSingleProjectApi = (id) => {
  return projectApi.get(`/${id}`);
};

// Update Project
export const updateProjectApi = (id, data) => {
  return projectApi.put(`/${id}`, data);
};

// Delete Project
export const deleteProjectApi = (id) => {
  return projectApi.delete(`/${id}`);
};

export default projectApi;
