import {ethers} from "ethers";
import { encrypt, decrypt } from "../../utils/encryption";
import { ApiError } from "../../utils/errors";

class EthereumWallet {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  }

  async createWallet() {
    try {
      const wallet = ethers.Wallet.createRandom();
      const encryptedPrivateKey = await encrypt(wallet.privateKey);
      
      return {
        address: wallet.address,
        encryptedPrivateKey
      };
    } catch (error) {
      throw new ApiError(500, `Failed to create Ethereum wallet: ${error.message}`);
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return {
        balance: ethers.utils.formatEther(balance),
        symbol: 'ETH'
      };
    } catch (error) {
      throw new ApiError(500, `Failed to get ETH balance: ${error.message}`);
    }
  }

  async sendTransaction(encryptedPrivateKey, to, value) {
    try {
      const privateKey = await decrypt(encryptedPrivateKey);
      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(value.toString()),
        gasLimit: 21000
      });

      return {
        hash: tx.hash,
        from: wallet.address,
        to,
        value,
        chain: 'ethereum'
      };
    } catch (error) {
      throw new ApiError(500, `Failed to send ETH: ${error.message}`);
    }
  }

  validateAddress(address) {
    return ethers.utils.isAddress(address);
  }
}

export default new EthereumWallet();