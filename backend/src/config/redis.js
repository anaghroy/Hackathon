import { createClient } from "redis";
import { config } from "./config.js";

const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});


/**Connecting to Redis */
export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export { redisClient };
