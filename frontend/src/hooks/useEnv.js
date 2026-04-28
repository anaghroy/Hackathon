import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getEnvVarsApi, updateEnvVarsApi } from "../services/envApi.service";
import { setVariables, setLoading, setError } from "../store/slices/envSlice";

export const useEnv = () => {
  const dispatch = useDispatch();
  const envState = useSelector((state) => state.env);

  const fetchEnvVars = useCallback(async (projectId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await getEnvVarsApi(projectId);
      dispatch(setVariables(response.data.variables || {}));
      return response.data.variables;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch environment variables";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const saveEnvVars = useCallback(async (projectId, variables) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await updateEnvVarsApi(projectId, variables);
      dispatch(setVariables(variables));
      toast.success("Environment variables saved successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save environment variables";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    ...envState,
    fetchEnvVars,
    saveEnvVars,
  };
};
