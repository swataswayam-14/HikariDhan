import {ethers} from "ethers";
import crypto from "crypto";

class EthereumWallet {
  constructor(provider) {
    this.provider = new ethers.providers.JsonRpcProvider(provider);
  }

  async createWallet() {
    try {
      // Generate random entropy
      const entropy = crypto.randomBytes(32);
      
      // Create wallet with entropy
      const wallet = ethers.Wallet.createRandom({
        entropy: entropy,
        provider: this.provider
      });

      return {
        address: wallet.address,
        privateKey: wallet.privateKey // In production, encrypt before storing
      };
    } catch (error) {
      throw new Error(`Failed to create Ethereum wallet: ${error.message}`);
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  async sendTransaction(privateKey, to, value) {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const transaction = {
        to,
        value: ethers.utils.parseEther(value)
      };

      const tx = await wallet.sendTransaction(transaction);
      return tx.hash;
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}

export default new EthereumWallet();