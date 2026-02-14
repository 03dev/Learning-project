import { Router, Request, Response } from 'express';
import { credentialsSchema } from '../validators/auth.schema';
import prisma from '../db/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;


// Signup route
router.post('/signup', async (req: Request, res: Response) => {
    const result = credentialsSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }

    const { email, password} = result.data;

    const existingUser = await prisma.user.findUnique({where: { email }});

    if(existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Store user in db
    await prisma.user.create({
        data: {
            email,
            passwordHash
        }
    });
    
    console.log("Email: ", email);
    console.log("Hashed Password: ", passwordHash);

    res.status(200).json({
        message: "User registered successfully"
    })
});

// login route
router .post('/login', async (req: Request, res: Response) => {
    const result = credentialsSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({where: { email }});

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'lax',
    });

    res.status (200).json({
        message: "Login successful",
    });
});

// protected route example
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    res.json({ userId });
});

export default router;