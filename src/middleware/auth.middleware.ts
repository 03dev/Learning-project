import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/request.types';
import { th } from 'zod/v4/locales';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if(!token) {
        return res.status(401).json({
            message: "Unauthorized: No token"
        });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as { id: number };

        // attach user info to request
        req.user = {
            id: Number(decode.id),
        };

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}