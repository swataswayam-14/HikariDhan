// wallet-service/src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import walletRoutes from './routes/wallet.js';
import { errorHandler } from './utils/errors.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimiter);


// API routes
app.use('/api/v1/wallet', walletRoutes);

// Error handling
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
mongoose.connection.on('error', (err) => {
   console.error('MongoDB connection error:', err);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

export default app;