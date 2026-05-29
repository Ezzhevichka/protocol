export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  redisUrl: process.env.REDIS_URL,
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
};

if (!env.sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}
