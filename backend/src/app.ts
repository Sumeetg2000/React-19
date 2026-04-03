import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { profileRouter } from "./routes/profile.routes";
import { blogRouter } from "./routes/blog.routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ data: { status: "ok" } });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/blogs", blogRouter);

app.use(notFound);
app.use(errorHandler);
