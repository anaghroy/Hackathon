import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { connectRepoApi, getReposApi } from "../services/repoApi.service";
import { setRepos, setLoading, setError } from "../store/slices/repoSlice";

export const useRepo = () => {
  const dispatch = useDispatch();
  const repoState = useSelector((state) => state.repo);

  const fetchRepos = useCallback(async (provider, search = "") => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await getReposApi(provider, search);
      dispatch(setRepos(response.data.repositories || []));
      return response.data.repositories;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch repositories";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const connectRepo = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await connectRepoApi(data);
      toast.success("Repository connected and project initialized!");
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to connect repository";
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    ...repoState,
    fetchRepos,
    connectRepo,
  };
};
