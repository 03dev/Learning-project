import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { BadRequestError } from "../errors/BadRequestError";
import { ValidationSchemas } from "../types/validation.types";
import { AppRequest } from "../types/request.types";

export const validateRequest = (schemas: ValidationSchemas) => (req: AppRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData: any = {};

    if (schemas.body) {
      validatedData.body = schemas.body.parse(req.body);
    }

    if (schemas.query) {
      validatedData.query = schemas.query.parse(req.query);
    }

    if (schemas.params) {
      validatedData.params = schemas.params.parse(req.params);
    }

    req.validated = validatedData;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new BadRequestError("Validation error: ", err.issues));
    }
    next(err);
  }
}
