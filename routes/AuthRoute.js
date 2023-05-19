import express from 'express';
import authController from '../controllers/authController.js';
import middlewareController from '../controllers/middlewareController.js';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh', authController.requestRefreshToken);
router.post('/logout', middlewareController.verifyTokenAndAdminAuth, authController.userLogout);

export default router;
