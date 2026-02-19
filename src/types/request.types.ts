import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}