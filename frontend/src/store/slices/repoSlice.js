import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repos: [],
  selectedRepo: null,
  loading: false,
  error: null,
};

export const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setRepos: (state, action) => {
      state.repos = action.payload;
    },
    setSelectedRepo: (state, action) => {
      state.selectedRepo = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearRepoState: (state) => {
      state.repos = [];
      state.selectedRepo = null;
      state.error = null;
    }
  },
});

export const {
  setRepos,
  setSelectedRepo,
  setLoading,
  setError,
  clearRepoState
} = repoSlice.actions;

export default repoSlice.reducer;
