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
  getSharedProjectsApi,
  addCollaboratorApi,
  bulkInviteApi,
  getRecentCollaboratorsApi,
} from "../services/projectApi.service";
import toast from "react-hot-toast";

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
  const updateProject = async (id, payload) => {
    try {
      dispatch(setLoading(true));
      // Normalize payload (backend expects title)
      const apiPayload = {
        title: payload.name || payload.title,
        description: payload.description,
      };

      const res = await updateProjectApi(id, apiPayload);
      if (res.data.success) {
        dispatch(updateProjectInState(res.data.project));
        toast.success("Project updated successfully");
        return res.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      dispatch(setError(message));
      toast.error(message);
      throw err;
    } finally {
      dispatch(setLoading(false));
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

  // Get shared projects
  const fetchSharedProjects = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getSharedProjectsApi();
      return res.data.projects;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Add collaborator
  const addCollaborator = async (id, data) => {
    try {
      const res = await addCollaboratorApi(id, data);
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  // Bulk Invite
  const bulkInvite = async (data) => {
    try {
      const res = await bulkInviteApi(data);
      return res.data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  // Recent Collaborators
  const fetchRecentCollaborators = async () => {
    try {
      const res = await getRecentCollaboratorsApi();
      return res.data.collaborators;
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
    fetchSharedProjects,
    addCollaborator,
    bulkInvite,
    fetchRecentCollaborators,
  };
};

export default useProject;