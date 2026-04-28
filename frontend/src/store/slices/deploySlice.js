import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDeployment: null,
  history: [],
  loading: false,
  error: null,
};

export const deploySlice = createSlice({
  name: "deploy",
  initialState,
  reducers: {
    setCurrentDeployment: (state, action) => {
      state.currentDeployment = action.payload;
    },
    setDeployHistory: (state, action) => {
      state.history = action.payload;
    },
    updateDeploymentStatus: (state, action) => {
      if (state.currentDeployment && state.currentDeployment._id === action.payload.id) {
        state.currentDeployment.status = action.payload.status;
        state.currentDeployment.logs = action.payload.logs;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearDeployState: (state) => {
      state.currentDeployment = null;
      state.history = [];
      state.error = null;
    }
  },
});

export const {
  setCurrentDeployment,
  setDeployHistory,
  updateDeploymentStatus,
  setLoading,
  setError,
  clearDeployState
} = deploySlice.actions;

export default deploySlice.reducer;
