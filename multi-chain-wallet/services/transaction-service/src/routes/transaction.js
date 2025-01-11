import { Router } from 'express';
import { transactionController } from '../controllers/transactionController.js';

const router = Router();

router.post('/', transactionController.createTransaction);
router.get('/:hash', transactionController.getTransaction);
router.get('/', transactionController.getUserTransactions);

export default router;