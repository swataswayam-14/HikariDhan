import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { setupEventHandlers } from './utils/eventBus.js';
import transactionRoutes from './routes/transaction.js';
import { errorHandler } from './utils/errors.js';
import authMiddleware from './middlewares/auth.js';
import { mongoDBUri } from './utils/config.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/v1/transactions', authMiddleware, transactionRoutes);

app.use(errorHandler);

async function initializeApp() {
  mongoose.connect(mongoDBUri, {
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