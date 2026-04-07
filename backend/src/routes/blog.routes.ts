import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";

const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
});

export const blogRouter = Router();

blogRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const searchParam = req.query.search;
    const search = typeof searchParam === "string" ? searchParam.trim() : "";

    const blogs = await prisma.blog.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                content: {
                  contains: search,
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ data: blogs });
  }),
);

blogRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const idParam = req.params.id;
    const id = typeof idParam === "string" ? idParam : "";

    if (!id) {
      throw new HttpError(404, "Blog not found");
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new HttpError(404, "Blog not found");
    }

    res.status(200).json({ data: blog });
  }),
);

blogRouter.post(
  "/",
  requireAuth,
  validateBody(createBlogSchema),
  asyncHandler(async (req, res) => {
    const userId = req.auth?.userId;

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const { title, content } = req.body as z.infer<typeof createBlogSchema>;

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ data: blog });
  }),
);
