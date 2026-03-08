import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 403, details);
    }
}