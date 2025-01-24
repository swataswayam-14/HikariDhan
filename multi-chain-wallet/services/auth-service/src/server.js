import app from '../../auth-service/src/app.js';
import redis from './utils/redis.js';
import { PORT } from './utils/config.js';
import logger from './utils/logger.js';


async function startServer() {
  try {
    await redis.ping();
    logger.info('Redis connection established');

    app.listen(PORT, () => {
      logger.info(`Wallet service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error,'Failed to start server:');
    process.exit(1);
  }
}

startServer();