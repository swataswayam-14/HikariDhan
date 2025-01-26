import dotenv from 'dotenv';
dotenv.config();

export const redisHost = process.env.REDIS_HOST || "localhost";
export const redisPort = process.env.REDIS_PORT || 6379;
export const redisPassword = process.env.REDIS_PASSWORD || "mysupersecretpassword";
export const mongoDBUri = process.env.MONGODB_URI || "mongodb://localhost:27017/hikari";
export const PORT = process.env.PORT || 3002;
export const jwtSecret = process.env.JWT_SECRET || "mysecretapp";
export const ethereumRPCUrl = process.env.ETHEREUM_RPC_URL;
export const solanaRPCUrl = process.env.SOLANA_RPC_URL;
export const bitcoinAPIUrl = process.env.BITCOIN_API_URL;
export const natsURI = process.env.NATS_URL;