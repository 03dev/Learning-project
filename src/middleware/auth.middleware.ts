import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if(!token) {
        return res.status(401).json({
            message: "Unauthorized: No token"
        });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as { id: number };

        // attach user info to request
        (req as any).user = { id: decode.id };

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}