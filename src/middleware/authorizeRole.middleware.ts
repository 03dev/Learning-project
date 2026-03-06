import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AppRequest } from "../types/request.types"
import { Role } from "../types/roles.types";

export const authorizeRole = (...requiredRoles: Role[]) => {
    return (req: AppRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (!requiredRoles.includes(req.user.role as Role)) {
      return next(new UnauthorizedError("Access denied"));
    }

    next();
  };
}