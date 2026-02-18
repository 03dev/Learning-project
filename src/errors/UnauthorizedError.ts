import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 401, details);
    }
}