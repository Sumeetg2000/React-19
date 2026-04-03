"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const auth_routes_1 = require("./routes/auth.routes");
const profile_routes_1 = require("./routes/profile.routes");
const blog_routes_1 = require("./routes/blog.routes");
const errorHandler_1 = require("./middleware/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
}));
exports.app.use(express_1.default.json());
exports.app.get("/health", (_req, res) => {
    res.status(200).json({ data: { status: "ok" } });
});
exports.app.use("/auth", auth_routes_1.authRouter);
exports.app.use("/profile", profile_routes_1.profileRouter);
exports.app.use("/blogs", blog_routes_1.blogRouter);
exports.app.use(errorHandler_1.notFound);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map