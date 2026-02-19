import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginController, meController, signUpController } from '../controllers/auth.controller';
import { asyncHander } from '../utils/asyncHander';
import { validateRequest } from '../middleware/validate.middleware';
import { credentialsSchema } from '../validators/auth.schema';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;


// Signup route
router.post('/signup',validateRequest(credentialsSchema), asyncHander(signUpController));

// login route
router .post('/login', validateRequest(credentialsSchema), asyncHander(loginController));

// protected route example
router.get('/me', authMiddleware, asyncHander(meController));

export default router;