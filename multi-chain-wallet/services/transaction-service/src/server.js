import app from './app.js';
import redis from '../../transaction-service/src/utils/redis.js';
import { PORT } from './utils/config.js';

async function startServer() {
  try {
    await redis.ping();
    console.log('Redis connection established');

    app.listen(PORT, () => {
      console.log(`Transaction service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();