import { signUp, login, refreshUserToken } from "../services/auth.service";
import { Request, Response } from "express";
import { AppRequest, AuthenticatedRequest } from "../types/request.types";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export const signUpController = async (req: AppRequest, res: Response) => {
    await signUp(req.body);

    return res.status(201).json({
        message: "User registered successfully"
    });
};

export const loginController = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await login(req.body);
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'lax',
        path: '/auth/refresh', // VERY IMPORTANT
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        message: "Login successful",
        accessToken
    });
}

export const refreshTokenController = async (req: Request, res: Response) =>{
    const token = req.cookies.refreshToken;

    if(!token) {
        throw new UnauthorizedError("No refresh token provided");
    }

    const { newAccessToken, newRefreshToken } = await refreshUserToken(token);

    res.clearCookie('refreshToken', { path: '/auth/refresh' });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'lax',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        newAccessToken,
    });
}

export const meController = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;

    return res.json({ userId });
}