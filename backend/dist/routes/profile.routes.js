"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../config/prisma");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const asyncHandler_1 = require("../utils/asyncHandler");
const httpError_1 = require("../utils/httpError");
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Name is required"),
});
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.use(auth_1.requireAuth);
exports.profileRouter.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.auth?.userId;
    if (!userId) {
        throw new httpError_1.HttpError(401, "Unauthorized");
    }
    const user = await prisma_1.prisma.user.findUnique({
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
        throw new httpError_1.HttpError(404, "User not found");
    }
    res.status(200).json({ data: user });
}));
exports.profileRouter.put("/", (0, validate_1.validateBody)(updateProfileSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.auth?.userId;
    if (!userId) {
        throw new httpError_1.HttpError(401, "Unauthorized");
    }
    const { name } = req.body;
    const updatedUser = await prisma_1.prisma.user.update({
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
}));
//# sourceMappingURL=profile.routes.js.map