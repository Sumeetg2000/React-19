import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, "Route not found"));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
