import { Request } from 'express';

export interface AppRequest extends Request {
  user?: {
    id: number;
  };

  validated?: {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };
}

export interface AuthenticatedRequest extends AppRequest {
  user: {
    id: number;
  };
}