export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  redisUrl: process.env.REDIS_URL,
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  // autoseed
  agentTokenSecret: process.env.AGENT_TOKEN_SECRET,
  switchCooldownSeconds: Number(process.env.SWITCH_COOLDOWN_SECONDS ?? 90),
  maxDailyPoints: Number(process.env.MAX_DAILY_POINTS ?? 2000),
};

if (!env.sessionSecret) {
  throw new Error("SESSION_SECRET is required");
}
if (!env.agentTokenSecret) {
  throw new Error("AGENT_TOKEN_SECRET is required");
}