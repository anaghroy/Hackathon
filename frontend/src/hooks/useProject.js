import { useDispatch, useSelector } from "react-redux";
import {
  setProjects,
  addProject,
  setSelectedProject,
  updateProjectInState,
  deleteProjectFromState,
  setLoading,
  setError,
} from "../store/slices/projectSlice";

import {
  createProjectApi,
  getProjectsApi,
  getSingleProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "../services/projectApi.service";

export const useProject = () => {
  const dispatch = useDispatch();
  const { projects, selectedProject, loading, error } = useSelector(
    (state) => state.project
  );

  // Get all projects
  const fetchProjects = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getProjectsApi();
      dispatch(setProjects(res.data.projects));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Create project
  const createProject = async (data) => {
    try {
      const res = await createProjectApi(data);
      dispatch(addProject(res.data.project));
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  // Get single project
  const getProject = async (id) => {
    try {
      const res = await getSingleProjectApi(id);
      dispatch(setSelectedProject(res.data.project));
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  // Update project
  const updateProject = async (id, data) => {
    try {
      const res = await updateProjectApi(id, data);
      dispatch(updateProjectInState(res.data.project));
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      const res = await deleteProjectApi(id);
      dispatch(deleteProjectFromState(id));
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  return {
    projects,
    selectedProject,
    loading,
    error,
    fetchProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
  };
};

export default useProject;