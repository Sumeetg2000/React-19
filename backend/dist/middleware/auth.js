"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const httpError_1 = require("../utils/httpError");
const requireAuth = (req, _res, next) => {
    const authHeader = req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(new httpError_1.HttpError(401, "Unauthorized"));
        return;
    }
    const token = authHeader.slice("Bearer ".length).trim();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (typeof decoded !== "object" || decoded === null) {
            throw new httpError_1.HttpError(401, "Unauthorized");
        }
        const payload = decoded;
        if (!payload.sub || !payload.email) {
            throw new httpError_1.HttpError(401, "Unauthorized");
        }
        req.auth = {
            userId: payload.sub,
            email: payload.email,
        };
        next();
    }
    catch {
        next(new httpError_1.HttpError(401, "Unauthorized"));
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map