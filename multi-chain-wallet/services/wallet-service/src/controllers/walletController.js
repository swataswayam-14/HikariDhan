import { ApiError } from "../../utils/errors";
import  EthereumWallet from "../chains/ethereum/ethereumWallet";
import  BitcoinWallet from "../chains/bitcoin/bitcoinWallet";
import  SolanaWallet from "../chains/solana/solanaWallet";
import { redis } from "../utils/redis";
import  { validateChain } from "../utils/validators";

class WalletController {
  constructor() {
    this.wallets = {
      ethereum: new EthereumWallet(),
      bitcoin: new BitcoinWallet(),
      solana: new SolanaWallet()
    };
  }

  async createWallet(req, res, next) {
    try {
      const { chain } = req.params;
      const userId = req.user.userId;

      if (!validateChain(chain)) {
        throw new ApiError(400, 'Invalid blockchain specified');
      }

      const wallet = this.wallets[chain];
      const { address, encryptedPrivateKey } = await wallet.createWallet();

      // Store wallet info in Redis for quick access
      await redis.hset(
        `user:${userId}:wallets`,
        chain,
        JSON.stringify({ address, encryptedPrivateKey })
      );

      res.status(201).json({
        message: 'Wallet created successfully',
        data: { chain, address }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req, res, next) {
    try {
      const { chain, address } = req.params;
      
      if (!validateChain(chain)) {
        throw new ApiError(400, 'Invalid blockchain specified');
      }

      const wallet = this.wallets[chain];
      if (!wallet.validateAddress(address)) {
        throw new ApiError(400, 'Invalid address format');
      }

      const balance = await wallet.getBalance(address);
      
      res.json({
        data: balance
      });
    } catch (error) {
      next(error);
    }
  }

  async sendTransaction(req, res, next) {
    try {
      const { chain } = req.params;
      const { to, value } = req.body;
      const userId = req.user.userId;

      if (!validateChain(chain)) {
        throw new ApiError(400, 'Invalid blockchain specified');
      }

      const wallet = this.wallets[chain];
      if (!wallet.validateAddress(to)) {
        throw new ApiError(400, 'Invalid recipient address');
      }

      // Get wallet info from Redis
      const walletInfo = await redis.hget(`user:${userId}:wallets`, chain);
      if (!walletInfo) {
        throw new ApiError(404, 'Wallet not found');
      }

      const { encryptedPrivateKey } = JSON.parse(walletInfo);
      const transaction = await wallet.sendTransaction(encryptedPrivateKey, to, value);

      res.json({
        message: 'Transaction sent successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WalletController();