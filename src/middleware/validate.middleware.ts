import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export const validateRequest =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(new BadRequestError(JSON.stringify(formattedErrors)));
      }
    }
  };
