import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { setupEventHandlers } from './utils/eventBus.js';
import transactionRoutes from './routes/transaction.js';
import { errorHandler } from './utils/errors.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/v1/transactions', authMiddleware, transactionRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB and setup event handlers
async function initializeApp() {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  await setupEventHandlers();
  console.log('Transaction service initialized');
}

initializeApp().catch(console.error);

export default app;