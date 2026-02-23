import { Request } from "express";

export interface ValidatedRequest extends Request {
  validated?: {
    body?: any;
    query?: any;
    params?: any;
  };
}