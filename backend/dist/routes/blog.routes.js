"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../config/prisma");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
const createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title is required"),
    content: zod_1.z.string().trim().min(1, "Content is required"),
});
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const searchParam = req.query.search;
    const search = typeof searchParam === "string" ? searchParam.trim() : "";
    const blogs = await prisma_1.prisma.blog.findMany({
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
}));
exports.blogRouter.get("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const idParam = req.params.id;
    const id = typeof idParam === "string" ? idParam : "";
    if (!id) {
        throw new httpError_1.HttpError(404, "Blog not found");
    }
    const blog = await prisma_1.prisma.blog.findUnique({
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
        throw new httpError_1.HttpError(404, "Blog not found");
    }
    res.status(200).json({ data: blog });
}));
exports.blogRouter.post("/", auth_1.requireAuth, (0, validate_1.validateBody)(createBlogSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.auth?.userId;
    if (!userId) {
        throw new httpError_1.HttpError(401, "Unauthorized");
    }
    const { title, content } = req.body;
    const blog = await prisma_1.prisma.blog.create({
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
}));
//# sourceMappingURL=blog.routes.js.map