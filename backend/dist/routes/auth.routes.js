"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const validate_1 = require("../middleware/validate");
const httpError_1 = require("../utils/httpError");
const asyncHandler_1 = require("../utils/asyncHandler");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().trim().min(1, "Password is required"),
    name: zod_1.z.string().trim().min(1, "Name is required"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().trim().min(1, "Password is required"),
});
const createAuthToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ email }, env_1.env.JWT_SECRET, {
        subject: userId,
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
};
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", (0, validate_1.validateBody)(signupSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, name } = req.body;
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new httpError_1.HttpError(409, "Email is already registered");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
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
}));
exports.authRouter.post("/login", (0, validate_1.validateBody)(loginSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new httpError_1.HttpError(401, "Invalid credentials");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new httpError_1.HttpError(401, "Invalid credentials");
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
}));
//# sourceMappingURL=auth.routes.js.map