import "dotenv/config";

import express from "express";
import cors from "cors";

import { env } from "./config";
import { botAuth } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import warnRoutes from "./routes/warn.routes";

import playersRoutes from "./routes/players.routes";
import kickRoutes from "./routes/kick.routes";
import commandRoutes from "./routes/command.routes";
import { startLogBanEnforcementJob } from "./jobs/log-ban-enforcement.job";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/players", botAuth, playersRoutes);
app.use("/kick", botAuth, kickRoutes);
app.use("/command", botAuth, commandRoutes);
app.use("/warn", botAuth, warnRoutes);

app.use(errorMiddleware);

startLogBanEnforcementJob();

app.listen(env.port, () => {
  console.log(`RCON bot listening on port ${env.port}`);
});