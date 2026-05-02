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
  scanSecurityApi,
  analyzePerformanceApi,
  applyFixApi,
  debugErrorApi,
} from "../services/aiApi.service";
import {
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

  const scanSecurity = useCallback(async (projectId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await scanSecurityApi(projectId);
      dispatch(setSecurityResult(response.data));
      toast.success("Security scan completed");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to scan security";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const applyFix = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await applyFixApi(data);
      toast.success("Security fix applied successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to apply security fix";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const analyzePerformance = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await analyzePerformanceApi(projectId, data);
      dispatch(setPerformanceResult(response.data));
      toast.success("Performance analysis completed");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to analyze performance";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const debugError = useCallback(async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await debugErrorApi(projectId, data);
      dispatch(setDebugResult(response.data));
      toast.success("Error analysis completed");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to analyze error";
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
    scanSecurity,
    analyzePerformance,
    applyFix,
    debugError,
    resetAiState,
  };
};

