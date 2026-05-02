import axios from "axios";

const settingsApi = axios.create({
  baseURL: "/api/settings",
  withCredentials: true,
});

export const getSettings = async () => {
  const response = await settingsApi.get("/");
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await settingsApi.put("/", data);
  return response.data;
};
