import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../config/redis.js";

// Forgot Password (strict)
export const forgotPasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "forgot_password",
  points: 3, // max attempts
  duration: 60 * 1, // per minutes
});

// Login (moderate)
export const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "login",
  points: 3,
  duration: 60 * 1, // per minute
});

// Register (moderate)
export const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "register",
  points: 3,
  duration: 60 * 5,
});
