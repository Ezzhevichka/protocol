import { RedisStore } from 'connect-redis';
import session from 'express-session';

import { env } from '../config/env';
import { redisClient } from '../lib/redis';

export const sessionMiddleware = session({
  name: 'sid',
  store: new RedisStore({
    client: redisClient,
    prefix: 'steam-auth:',
  }),
  secret: env.sessionSecret!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.nodeEnv === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
