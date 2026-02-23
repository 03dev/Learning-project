import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginController, meController, signUpController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateRequest } from '../middleware/validate.middleware';
import { credentialsSchema } from '../validators/auth.schema';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;


// Signup route
router.post('/signup',validateRequest({body: credentialsSchema}), asyncHandler(signUpController));

// login route
router .post('/login', validateRequest({body: credentialsSchema}), asyncHandler(loginController));

// protected route example
router.get('/me', authMiddleware, asyncHandler(meController));

export default router;