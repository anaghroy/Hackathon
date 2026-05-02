import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { 
  triggerDeployApi, 
  getDeployStatusApi, 
  getDeployHistoryApi,
  getDeployLogsApi,
  rollbackDeployApi
} from "../services/deployApi.service";
import { 
  setCurrentDeployment, 
  setDeployHistory, 
  setLoading, 
  setError 
} from "../store/slices/deploySlice";

export const useDeploy = () => {
  const dispatch = useDispatch();
  const deployState = useSelector((state) => state.deploy);

  const triggerDeployment = useCallback(async (projectId, data = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await triggerDeployApi(projectId, data);
      dispatch(setCurrentDeployment(response.data.deployment));
      toast.success("Deployment triggered successfully!");
      return response.data.deployment;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to trigger deployment";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchDeployStatus = useCallback(async (projectId) => {
    try {
      const response = await getDeployStatusApi(projectId);
      dispatch(setCurrentDeployment(response.data.deployment));
      return response.data.deployment;
    } catch (err) {
      console.error("Failed to fetch deployment status", err);
    }
  }, [dispatch]);

  const fetchDeployHistory = useCallback(async (projectId) => {
    try {
      dispatch(setLoading(true));
      const response = await getDeployHistoryApi(projectId);
      dispatch(setDeployHistory(response.data.history || []));
      return response.data.history;
    } catch (err) {
      console.error("Failed to fetch deployment history", err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchLogs = useCallback(async (projectId, params = {}) => {
    try {
      const response = await getDeployLogsApi(projectId, params);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch logs", err);
      return null;
    }
  }, []);

  const rollbackDeployment = useCallback(async (projectId, targetDeploymentId) => {
    try {
      dispatch(setLoading(true));
      const response = await rollbackDeployApi(projectId, targetDeploymentId);
      dispatch(setCurrentDeployment(response.data.deployment));
      toast.success("Rollback initiated successfully!");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to initiate rollback";
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    ...deployState,
    triggerDeployment,
    fetchDeployStatus,
    fetchDeployHistory,
    fetchLogs,
    rollbackDeployment
  };
};
