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

  // Helper for POST streaming
  const postStream = async (url, body, onChunk) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Stream request failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              fullText += data.chunk;
              onChunk(fullText);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    }
    return fullText;
  };

  const processIntent = useCallback(async (projectId, data, options = {}) => {
    const { stream = false } = options;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      if (stream) {
        const fullText = await postStream(`/api/ai/intent/${projectId}?stream=true`, data, (text) => {
          dispatch(setIntentResult({ aiAnalysis: text }));
        });
        toast.success("Intent processed");
        return fullText;
      }

      const response = await intentApi(projectId, data);
      dispatch(setIntentResult(response.data));
      toast.success("Intent processed successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to process intent";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const getArchitectureGraph = useCallback(async (projectId, options = {}) => {
    const { stream = false } = options;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      if (stream) {
        return new Promise((resolve, reject) => {
          const eventSource = new EventSource(`/api/ai/explain-ai/${projectId}?stream=true`, {
            withCredentials: true
          });
          let fullText = "";

          let currentGraph = null;
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.graph) {
              currentGraph = data.graph;
              dispatch(setArchitectureGraph({ graph: data.graph, explanation: "" }));
            }
            if (data.chunk) {
              fullText += data.chunk;
              // Throttle Redux updates for the explanation to improve performance
              if (!window._aiThrottle) {
                window._aiThrottle = setTimeout(() => {
                  dispatch(setArchitectureGraph({ graph: currentGraph, explanation: fullText }));
                  window._aiThrottle = null;
                }, 80); // 80ms throttle for smooth balance between real-time and performance
              }
            }
            if (data.done) {
              const finalData = { graph: data.graph || currentGraph, explanation: data.explanation };
              dispatch(setArchitectureGraph(finalData));
              eventSource.close();
              resolve(finalData);
            }
          };

          eventSource.onerror = (err) => {
            eventSource.close();
            reject(new Error("Streaming failed"));
          };
        });
      }

      const response = await explainAiApi(projectId);
      dispatch(setArchitectureGraph(response.data));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch architecture graph";
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

  const debugError = useCallback(async (projectId, data, options = {}) => {
    const { stream = false } = options;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      if (stream) {
        const fullText = await postStream(`/api/ai/debug-error/${projectId}?stream=true`, data, (text) => {
          dispatch(setDebugResult({ analysis: text }));
        });
        toast.success("Debug analysis completed");
        return fullText;
      }

      const response = await debugErrorApi(projectId, data);
      dispatch(setDebugResult(response.data));
      toast.success("Error analysis completed");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to analyze error";
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

