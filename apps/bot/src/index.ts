import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { startServersSnapshotWorker } from 'services/servers-snapshot.service';

import { startLogBanEnforcementJob } from './jobs/log-ban-enforcement.job';
import { botAuth } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import commandRoutes from './routes/command.routes';
import kickRoutes from './routes/kick.routes';
import warnRoutes from './routes/warn.routes';
import { closeRcon, getRconHealth } from './services/rcon.service';
import { startPlayersSnapshotWorker, stopPlayersSnapshotWorker } from './services/server-info-snapshot.service';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, rcon: getRconHealth() });
});

app.use('/kick', botAuth, kickRoutes);
app.use('/command', botAuth, commandRoutes);
app.use('/warn', botAuth, warnRoutes);

app.use(errorMiddleware);

startLogBanEnforcementJob();
startPlayersSnapshotWorker();
startServersSnapshotWorker();

app.listen(Number(process.env.PORT), () => {
  console.log(`RCON bot listening on port ${process.env.PORT}`);
});

process.on('SIGINT', async () => {
  stopPlayersSnapshotWorker();
  await closeRcon();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  stopPlayersSnapshotWorker();
  await closeRcon();
  process.exit(0);
});
