import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';
import axios from 'axios';

export class TransactionProcessor {
  constructor() {
    this.providers = {
      ethereum: new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL),
      solana: new Connection(process.env.SOLANA_RPC_URL),
      bitcoin: process.env.BITCOIN_API_URL
    };
  }

  async processTransaction(transactionData) {
    const { chain } = transactionData;
    const processor = this[`process${chain.charAt(0).toUpperCase() + chain.slice(1)}Transaction`];
    
    if (!processor) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    return processor.call(this, transactionData);
  }

  async processEthereumTransaction(transactionData) {
    const { hash } = transactionData;
    const receipt = await this.providers.ethereum.getTransactionReceipt(hash);
    
    if (!receipt) {
      return { status: 'pending' };
    }

    const tx = await this.providers.ethereum.getTransaction(hash);
    
    return {
      status: receipt.status ? 'confirmed' : 'failed',
      confirmations: receipt.confirmations,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: tx.gasPrice.toString(),
      fee: receipt.gasUsed.mul(tx.gasPrice).toString(),
      nonce: tx.nonce
    };
  }

  async processSolanaTransaction(transactionData) {
    const { hash } = transactionData;
    const tx = await this.providers.solana.getTransaction(hash);
    
    if (!tx) {
      return { status: 'pending' };
    }

    return {
      status: tx.meta.err ? 'failed' : 'confirmed',
      confirmations: 1, // Solana transactions are final once confirmed
      blockNumber: tx.slot,
      fee: tx.meta.fee.toString(),
      timestamp: new Date(tx.blockTime * 1000)
    };
  }

  async processBitcoinTransaction(transactionData) {
    const { hash } = transactionData;
    const response = await axios.get(`${this.providers.bitcoin}/tx/${hash}`);
    const tx = response.data;

    return {
      status: tx.confirmations > 0 ? 'confirmed' : 'pending',
      confirmations: tx.confirmations,
      blockNumber: tx.block_height,
      blockHash: tx.block_hash,
      fee: tx.fees.toString(),
      timestamp: new Date(tx.received)
    };
  }
}
