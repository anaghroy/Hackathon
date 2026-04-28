import axios from "axios";

const repoApi = axios.create({
  baseURL: "/api/repos",
  withCredentials: true,
});

export const connectRepoApi = (data) => {
  return repoApi.post("/connect", data);
};

export const getReposApi = (provider) => {
  return repoApi.get(`/${provider}/list`);
};

export default repoApi;
