import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { encrypt, decrypt }  from "../../utils/encryption";
import { ApiError } from "../../utils/errors";

class SolanaWallet {
  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL);
  }

  async createWallet() {
    try {
      const keypair = Keypair.generate();
      const encryptedPrivateKey = await encrypt(
        Buffer.from(keypair.secretKey).toString('hex')
      );

      return {
        address: keypair.publicKey.toString(),
        encryptedPrivateKey
      };
    } catch (error) {
      throw new ApiError(500, `Failed to create Solana wallet: ${error.message}`);
    }
  }

  async getBalance(address) {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      
      return {
        balance: balance / 1e9,
        symbol: 'SOL'
      };
    } catch (error) {
      throw new ApiError(500, `Failed to get SOL balance: ${error.message}`);
    }
  }

  async sendTransaction(encryptedPrivateKey, to, value) {
    try {
      const privateKey = await decrypt(encryptedPrivateKey);
      const keypair = Keypair.fromSecretKey(
        Buffer.from(privateKey, 'hex')
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(to),
          lamports: value * 1e9
        })
      );

      const signature = await this.connection.sendTransaction(
        transaction,
        [keypair]
      );

      return {
        hash: signature,
        from: keypair.publicKey.toString(),
        to,
        value,
        chain: 'solana'
      };
    } catch (error) {
      throw new ApiError(500, `Failed to send SOL: ${error.message}`);
    }
  }

  validateAddress(address) {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new SolanaWallet();