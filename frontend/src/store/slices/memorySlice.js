import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memories: [],
  loading: false,
  error: null,
};

export const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {
    setMemories: (state, action) => {
      state.memories = action.payload;
    },
    addMemory: (state, action) => {
      state.memories.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMemories, addMemory, setLoading, setError } =
  memorySlice.actions;

export default memorySlice.reducer;
