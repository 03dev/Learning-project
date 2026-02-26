import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import * as AuthRepository from "../repositories/auth.repository";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signUp = async (data: { email: string, password: string}) => {
    const { email, password} = data;
    const existingUser = await AuthRepository.findUserByEmail(email);

    if(existingUser) {
        throw new BadRequestError("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    return AuthRepository.createUser(email, passwordHash);
};

export const login = async (data: {email: string, password: string}) => {
    const { email, password } = data;
    const user = await AuthRepository.findUserByEmail(email);

    if(!user) {
        throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign({id: user.id}, JWT_SECRET, { expiresIn: '1h' });

    return token;
}