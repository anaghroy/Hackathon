import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variables: {},
  loading: false,
  error: null,
};

export const envSlice = createSlice({
  name: "env",
  initialState,
  reducers: {
    setVariables: (state, action) => {
      state.variables = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearEnvState: (state) => {
      state.variables = {};
      state.error = null;
    }
  },
});

export const {
  setVariables,
  setLoading,
  setError,
  clearEnvState
} = envSlice.actions;

export default envSlice.reducer;
