export const rateLimitMiddleware = (limiter, keyFn = (req) => req.ip) => {
  return async (req, res, next) => {
    const key = keyFn(req);
    try {
      const before = await limiter.get(key);

      const result = await limiter.consume(key);

      next();
    } catch (rejRes) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter: rejRes?.msBeforeNext
          ? Math.round(rejRes.msBeforeNext / 1000) || 1
          : 300,
      });
    }
  };
};
