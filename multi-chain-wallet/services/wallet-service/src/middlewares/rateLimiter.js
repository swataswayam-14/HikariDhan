import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../utils/redis";

const rateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate-limit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests, please try again later',
      status: 429
    }
  }
});

export default new rateLimiter();