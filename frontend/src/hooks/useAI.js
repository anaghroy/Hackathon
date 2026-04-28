import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  intentApi,
  explainAiApi,
  explainRawApi,
  generateSchemaApi,
  generateTestsApi,
  reviewCodeApi,
} from "../services/aiApi.service";
import {
  setIntentResult,
  setArchitectureGraph,
  setDbSchema,
  setTestCode,
  setCodeReview,
  setLoading,
  setError,
  clearAiState,
} from "../store/slices/aiSlice";

export const useAI = () => {
  const dispatch = useDispatch();
  const aiState = useSelector((state) => state.ai);

  const processIntent = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await intentApi(projectId, data);
      dispatch(setIntentResult(response.data));
      toast.success("Intent processed successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process intent";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const getArchitectureGraph = useCallback(async (projectId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await explainAiApi(projectId);
      dispatch(setArchitectureGraph(response.data));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch architecture graph";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const getRawGraph = useCallback(async (projectId) => {
    try {
      const response = await explainRawApi(projectId);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch raw graph";
      toast.error(msg);
      throw err;
    }
  }, []);

  const generateDbSchema = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await generateSchemaApi(projectId, data);
      dispatch(setDbSchema(response.data));
      toast.success("Schema generated successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate schema";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const generateTests = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await generateTestsApi(projectId, data);
      dispatch(setTestCode(response.data));
      toast.success("Tests generated successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate tests";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const reviewCode = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await reviewCodeApi(projectId, data);
      dispatch(setCodeReview(response.data));
      toast.success("Code reviewed successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to review code";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const resetAiState = useCallback(() => {
    dispatch(clearAiState());
  }, [dispatch]);

  return {
    ...aiState,
    processIntent,
    getArchitectureGraph,
    getRawGraph,
    generateDbSchema,
    generateTests,
    reviewCode,
    resetAiState,
  };
};

