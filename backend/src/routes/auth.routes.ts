import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { validateBody } from "../middleware/validate";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

const signupSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().trim().min(1, "Password is required"),
  name: z.string().trim().min(1, "Name is required"),
});

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

const createAuthToken = (userId: string, email: string): string => {
  return jwt.sign({ email }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const authRouter = Router();

authRouter.post(
  "/signup",
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body as z.infer<typeof signupSchema>;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new HttpError(409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = createAuthToken(user.id, user.email);

    res.status(201).json({
      data: {
        token,
        user,
      },
    });
  }),
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = createAuthToken(user.id, user.email);

    res.status(200).json({
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  }),
);
