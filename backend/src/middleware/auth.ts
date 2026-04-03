import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

type AuthTokenPayload = JwtPayload & {
  sub: string;
  email: string;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new HttpError(401, "Unauthorized"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded !== "object" || decoded === null) {
      throw new HttpError(401, "Unauthorized");
    }

    const payload = decoded as AuthTokenPayload;

    if (!payload.sub || !payload.email) {
      throw new HttpError(401, "Unauthorized");
    }

    req.auth = {
      userId: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    next(new HttpError(401, "Unauthorized"));
  }
};
