
import { credentialsSchema } from "../validators/auth.schema"
import { BadRequestError } from "../errors/BadRequestError";
import { signUp } from "../services/auth.service";
import { login } from "../services/auth.service";
import { Request, Response } from "express";
import { AuthRequest } from "../types/request.types";

export const signUpController = async (req: AuthRequest, res: Response) => {
    const result = credentialsSchema.safeParse(req.body);

    if(!result.success) {
        throw new BadRequestError("Invalid input: ", result.error.flatten().fieldErrors);
    }

    await signUp(result.data);
    
    return res.status(201).json({
        message: "User registered successfully"
    });
};

export const loginController = async (req: Request, res: Response) => {
    console.log("Controller hit");
    const token = await login(req.body);
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: 'lax',
    });

    return res.status(200).json({
        message: "Login successful"
    });
}

export const meController = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    return res.json({ userId });
}