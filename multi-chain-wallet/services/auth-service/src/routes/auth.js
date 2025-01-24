import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js"
import authMiddleware from "../middlewares/auth.js";

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;