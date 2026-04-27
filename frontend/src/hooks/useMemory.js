import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getMemoryApi, addMemoryApi } from "../services/memoryApi.service";
import { setMemories, addMemory, setLoading, setError } from "../store/slices/memorySlice";

export const useMemory = () => {
  const dispatch = useDispatch();
  const memoryState = useSelector((state) => state.memory);

  const fetchMemories = async (projectId) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await getMemoryApi(projectId);
      dispatch(setMemories(response.data.memories || response.data || []));
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch memories";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createMemory = async (projectId, data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await addMemoryApi(projectId, data);
      dispatch(addMemory(response.data.memory || response.data));
      toast.success("Memory added successfully");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add memory";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    ...memoryState,
    fetchMemories,
    createMemory,
  };
};
