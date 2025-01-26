import Redis from 'ioredis';
import { redisHost, redisPassword, redisPort } from './config.js';

const redis = new Redis({
  host: redisHost|| 'localhost',
  port: redisPort || 6379,
  password: redisPassword,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;