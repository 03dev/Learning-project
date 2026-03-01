import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppRequest } from '../types/request.types';
import { th } from 'zod/v4/locales';
import { UnauthorizedError } from '../errors/UnauthorizedError';

const JWT_SECRET = env.ACCESSTOKEN;

export const authMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError("Unauthorized: No access token provided"));
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(accessToken, JWT_SECRET) as { id: number };

        // attach user info to request
        req.user = { id: decode.id };

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}