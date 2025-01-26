import { Transaction } from '../models/Transaction.js';
import { ApiError } from '../utils/errors.js';
import { publishEvent } from '../utils/eventBus.js';


export const transactionController = {
  async createTransaction(req, res) {
    try {
      const { userId } = req.user;
      const transactionData = { ...req.body, userId };
      
      const transaction = new Transaction(transactionData);
      await transaction.save();

      await publishEvent('transaction.created', transaction);

      res.status(201).json({ 
        message: 'Transaction created successfully',
        data: transaction 
      });
    } catch (error) {
      throw new ApiError(500, `Failed to create transaction: ${error.message}`);
    }
  },

  async getTransaction(req, res) {
    try {
      const { hash } = req.params;
      const { userId } = req.user;

      const transaction = await Transaction.findOne({ hash, userId });
      if (!transaction) {
        throw new ApiError(404, 'Transaction not found');
      }

      res.json({ data: transaction });
    } catch (error) {
      throw new ApiError(500, `Failed to get transaction: ${error.message}`);
    }
  },

  async getUserTransactions(req, res) {
    try {
      const { userId } = req.user;
      const { chain, status, page = 1, limit = 10 } = req.query;

      const query = { userId };
      if (chain) query.chain = chain;
      if (status) query.status = status;

      const transactions = await Transaction.find(query)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Transaction.countDocuments(query);

      res.json({
        data: transactions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      throw new ApiError(500, `Failed to get transactions: ${error.message}`);
    }
  }
};