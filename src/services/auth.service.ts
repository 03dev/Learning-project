import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../config/env";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import * as AuthRepository from "../repositories/auth.repository";

const ACCESS_SECRET = env.ACCESSTOKEN;
const REFRESH_SECRET = env.REFRESHTOKEN;

export const signUp = async (data: { email: string, password: string }) => {
    const { email, password } = data;
    const existingUser = await AuthRepository.findUserByEmail(email);

    if (existingUser) {
        throw new BadRequestError("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    return AuthRepository.createUser(email, passwordHash);
};

export const login = async (data: { email: string, password: string }) => {
    const { email, password } = data;
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
        throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const dbToken = await AuthRepository.createRefreshToken(user.id);

    const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, tokenId: dbToken.id}, REFRESH_SECRET, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await AuthRepository.updateRefreshToken(dbToken.id, hashedRefreshToken);

    return { accessToken, refreshToken };
}

export const refreshUserToken = async (token: string) => {
    let decoded: { id: number, tokenId: number };

    try {
        decoded = jwt.verify(token, REFRESH_SECRET) as { id: number, tokenId: number };
    } catch (err) {
        throw new UnauthorizedError("Invalid or expired refresh token")
    }

    const {id, tokenId} = decoded;

    const storedToken = await AuthRepository.getRefreshTokenByTokenId(tokenId);

    if (!storedToken) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.userId !== id) {
        throw new UnauthorizedError("Token mismatch");
    }

    if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError("Refresh token expired");
    }

    const isValid = await bcrypt.compare(token, storedToken.token);

    if (!isValid) {
        throw new UnauthorizedError("Invalid refresh token");
    }
    
    await AuthRepository.deleteRefreshToken(storedToken.id);

    const dbToken = await AuthRepository.createRefreshToken(id);

    const newAccessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: decoded.id, tokenId: dbToken.id}, REFRESH_SECRET, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await AuthRepository.updateRefreshToken(dbToken.id, hashedRefreshToken);

    return { newAccessToken, newRefreshToken };
}