import { redisClient } from "../config/redis.js";

// key builder
export const buildExplainKey = (projectId) => {
  return `ai:explain:${projectId}`;
};

// GET
export const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

// SET (TTL in seconds)
export const setCache = async (key, value, ttl = 300) => {
  await redisClient.setEx(key, ttl, JSON.stringify(value));
};

// DELETE
export const deleteCache = async (key) => {
  await redisClient.del(key);
};