"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const httpError_1 = require("../utils/httpError");
const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issue = error.issues[0];
                const message = issue?.message ?? "Invalid request body";
                next(new httpError_1.HttpError(400, message));
                return;
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
//# sourceMappingURL=validate.js.map