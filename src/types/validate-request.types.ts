import { Request } from "express";

export interface ValidatedRequest<TParams = {}, TQuery = {}, TBody = {}> extends Request {
  validated: {
    body: TBody;
    query: TQuery;
    params: TParams;
  };
}