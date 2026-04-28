import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import aiReducer from "./slices/aiSlice";
import memoryReducer from "./slices/memorySlice";
import repoReducer from "./slices/repoSlice";
import deployReducer from "./slices/deploySlice";
import envReducer from "./slices/envSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    ai: aiReducer,
    memory: memoryReducer,
    repo: repoReducer,
    deploy: deployReducer,
    env: envReducer,
  },
});
