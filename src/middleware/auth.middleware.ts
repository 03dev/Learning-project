import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/request.types';
import { th } from 'zod/v4/locales';
import { UnauthorizedError } from '../errors/UnauthorizedError';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if(!token) {
        return next(new UnauthorizedError("Unauthorized: No token provided"));
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as { id: number };

        // attach user info to request
        req.user = { id: decode.id };

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}