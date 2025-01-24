import Redis from 'ioredis';
import { redisHost, redisPort, redisPassword } from './config.js';
import logger from './logger.js';

const redis = new Redis({
  host: redisHost || 'localhost',
  port: redisPort || 6379,
  password: redisPassword,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

export default redis;