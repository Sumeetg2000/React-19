"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const httpError_1 = require("../utils/httpError");
const notFound = (_req, _res, next) => {
    next(new httpError_1.HttpError(404, "Route not found"));
};
exports.notFound = notFound;
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof httpError_1.HttpError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map