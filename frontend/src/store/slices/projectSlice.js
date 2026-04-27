import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },

    addProject: (state, action) => {
      state.projects.push(action.payload);
    },

    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },

    updateProjectInState: (state, action) => {
      const index = state.projects.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },

    deleteProjectFromState: (state, action) => {
      state.projects = state.projects.filter(
        (p) => p._id !== action.payload
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  setSelectedProject,
  updateProjectInState,
  deleteProjectFromState,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;