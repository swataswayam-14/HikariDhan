import app from './app.js';
import redis from '../../transaction-service/src/utils/redis.js';

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    // Ensure Redis is connected
    await redis.ping();
    console.log('Redis connection established');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Wallet service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();