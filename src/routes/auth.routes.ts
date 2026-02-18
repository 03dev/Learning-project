import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginController, meController, signUpController } from '../controllers/auth.controller';
import { asyncHander } from '../utils/asyncHander';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;


// Signup route
router.post('/signup', asyncHander(signUpController));

// login route
router .post('/login', asyncHander(loginController));

// protected route example
router.get('/me', authMiddleware, asyncHander(meController));

export default router;