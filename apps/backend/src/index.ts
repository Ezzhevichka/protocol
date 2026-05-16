import "dotenv/config";

import express from "express";
import cors from "cors";
import passport from "./passport";

import authRoutes from "./routes/auth.routes";
import meRoutes from "./routes/me.routes";
import bansRoutes from "./routes/bans.routes";
import playersRoutes from "./routes/players.routes";
import serversRoutes from "./routes/servers.routes";
import { env } from "./config/env";
import { startExpireBansJob } from "./jobs/expire-bans.job";
import { sessionMiddleware } from "./middleware/session.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { requireAuth } from "./middleware/auth.middleware";
import internalRoutes from "./routes/internal.routes";
import privilegesRoutes from "./routes/privileges.routes";
import remoteBotRoutes from "./routes/remote-bot.routes";
import nicknameBlacklistRoutes from "./routes/nickname-blacklist.routes";
import punishmentsRoutes from "./routes/punishments.routes";

import { redisClient } from "./lib";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

redisClient.connect().catch(console.error);

app.use(express.json());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/me", requireAuth, meRoutes);
app.use("/bans", requireAuth, bansRoutes);
app.use("/players", requireAuth, playersRoutes);
app.use("/servers", requireAuth, serversRoutes);
app.use("/privileges", requireAuth, privilegesRoutes);
app.use("/remote-bot", requireAuth, remoteBotRoutes);
app.use("/nickname-blacklist", requireAuth, nicknameBlacklistRoutes);
app.use("/punishments", requireAuth, punishmentsRoutes);
app.use("/internal", internalRoutes);

app.use(errorMiddleware);

startExpireBansJob();

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});