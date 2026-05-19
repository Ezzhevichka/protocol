import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { env } from './config';
import { startLogBanEnforcementJob } from './jobs/log-ban-enforcement.job';
import { botAuth } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import serverRoutes from './routes/server.routes';
import commandRoutes from './routes/command.routes';
import kickRoutes from './routes/kick.routes';
import playersRoutes from './routes/players.routes';
import warnRoutes from './routes/warn.routes';
import { closeRcon } from './services/rcon.service';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.use('/server', botAuth, serverRoutes);
app.use('/players', botAuth, playersRoutes);
app.use('/kick', botAuth, kickRoutes);
app.use('/command', botAuth, commandRoutes);
app.use('/warn', botAuth, warnRoutes);

app.use(errorMiddleware);

startLogBanEnforcementJob();

app.listen(env.port, () => {
    console.log(`RCON bot listening on port ${env.port}`);
});

process.on('SIGINT', async () => {
    await closeRcon();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeRcon();
    process.exit(0);
});
