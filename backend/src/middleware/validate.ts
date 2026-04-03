import type { NextFunction, Request, Response } from "express";
import { z, ZodError, type ZodTypeAny } from "zod";
import { HttpError } from "../utils/httpError";

export const validateBody = <TSchema extends ZodTypeAny>(schema: TSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as z.infer<TSchema>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const message = issue?.message ?? "Invalid request body";
        next(new HttpError(400, message));
        return;
      }
      next(error);
    }
  };
};
