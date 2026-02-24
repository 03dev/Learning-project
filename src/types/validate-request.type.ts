import { Request } from "express";

export interface ValidatedRequest<p = {}, q = {}, b = {}> extends Request {
  validated: {
    body: b;
    query: q;
    params: p;
  };
}