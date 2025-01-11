import bitcoin from "bitcoinjs-lib";
import axios from "axios";
import { encrypt, decrypt }  from "../../utils/encryption";
import { ApiError } from "../../utils/errors";

class BitcoinWallet {
  constructor() {
    this.network = bitcoin.networks.bitcoin;
    this.apiUrl = process.env.BITCOIN_API_URL;
  }

  async createWallet() {
    try {
      const keyPair = bitcoin.ECPair.makeRandom({ network: this.network });
      const { address } = bitcoin.payments.p2pkh({ 
        pubkey: keyPair.publicKey,
        network: this.network 
      });

      const privateKey = keyPair.toWIF();
      const encryptedPrivateKey = await encrypt(privateKey);

      return {
        address,
        encryptedPrivateKey
      };
    } catch (error) {
      throw new ApiError(500, `Failed to create Bitcoin wallet: ${error.message}`);
    }
  }

  async getBalance(address) {
    try {
      const response = await axios.get(`${this.apiUrl}/address/${address}/balance`);
      return {
        balance: response.data.balance / 1e8,
        symbol: 'BTC'
      };
    } catch (error) {
      throw new ApiError(500, `Failed to get BTC balance: ${error.message}`);
    }
  }

  async sendTransaction(encryptedPrivateKey, to, value) {
    try {
      const privateKey = await decrypt(encryptedPrivateKey);
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, this.network);
      
      // Note: This is a simplified version. In production, you'd need to:
      // 1. Get UTXOs for the address
      // 2. Calculate proper fee
      // 3. Create and sign the transaction with proper inputs/outputs
      // 4. Broadcast the transaction
      
      throw new ApiError(501, 'Bitcoin transaction sending not implemented');
    } catch (error) {
      throw new ApiError(500, `Failed to send BTC: ${error.message}`);
    }
  }

  validateAddress(address) {
    try {
      bitcoin.address.toOutputScript(address, this.network);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new BitcoinWallet();