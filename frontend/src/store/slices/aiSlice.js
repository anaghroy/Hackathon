import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  intentResult: null,
  architectureGraph: null,
  dbSchema: null,
  testCode: null,
  codeReview: null,
  securityResult: null,
  performanceResult: null,
  debugResult: null,
  loading: false,
  error: null,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setIntentResult: (state, action) => {
      state.intentResult = action.payload;
    },
    setArchitectureGraph: (state, action) => {
      state.architectureGraph = action.payload;
    },
    setDbSchema: (state, action) => {
      state.dbSchema = action.payload;
    },
    setTestCode: (state, action) => {
      state.testCode = action.payload;
    },
    setCodeReview: (state, action) => {
      state.codeReview = action.payload;
    },
    setSecurityResult: (state, action) => {
      state.securityResult = action.payload;
    },
    setPerformanceResult: (state, action) => {
      state.performanceResult = action.payload;
    },
    setDebugResult: (state, action) => {
      state.debugResult = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearAiState: (state) => {
      state.intentResult = null;
      state.architectureGraph = null;
      state.dbSchema = null;
      state.testCode = null;
      state.codeReview = null;
      state.securityResult = null;
      state.performanceResult = null;
      state.debugResult = null;
      state.error = null;
    }
  },
});

export const {
  setIntentResult,
  setArchitectureGraph,
  setDbSchema,
  setTestCode,
  setCodeReview,
  setSecurityResult,
  setPerformanceResult,
  setDebugResult,
  setLoading,
  setError,
  clearAiState
} = aiSlice.actions;

export default aiSlice.reducer;
