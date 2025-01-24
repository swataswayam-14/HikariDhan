import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import { mongoDBUri } from "./utils/config.js";
import logger from "./utils/logger.js";
import rateLimiter from "./middlewares/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);

app.use(errorHandler);

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  logger.error( err,'MongoDB connection error:');
});

export default app;