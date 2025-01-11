import express from "express";
const router = express.Router();
import walletController  from "../controllers/walletController";
import authMiddleware from "../middlewares/auth";

router.post('/:chain/create', authMiddleware, walletController.createWallet);
router.get('/:chain/:address/balance', authMiddleware, walletController.getBalance);
router.post('/:chain/send', authMiddleware, walletController.sendTransaction);

export default router;