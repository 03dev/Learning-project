import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AppRequest } from "../types/request.types"
import { Role } from "../types/roles.types";
import { ForbiddenError } from "../errors/ForbiddenError";

export const authorizeRole = (...requiredRoles: Role[]) => {
    return (req: AppRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (requiredRoles.length === 0) {
      throw new Error("authorizeRole requires at least one role");
    }

    if (!requiredRoles.includes(req.user.role as Role)) {
      return next(new ForbiddenError("Access denied"));
    }

    next();
  };
}