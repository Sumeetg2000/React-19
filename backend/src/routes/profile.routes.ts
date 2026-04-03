import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.auth?.userId;

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.status(200).json({ data: user });
  }),
);

profileRouter.put(
  "/",
  validateBody(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const userId = req.auth?.userId;

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const { name } = req.body as z.infer<typeof updateProfileSchema>;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ data: updatedUser });
  }),
);
