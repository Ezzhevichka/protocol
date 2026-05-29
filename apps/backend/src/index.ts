import 'dotenv/config';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { env } from './config/env';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { startExpireBansJob } from './jobs/expire-bans.job';
import { redisClient } from './lib';
import { sessionMiddleware } from './middleware/session.middleware';
import passport from './passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  redisClient.connect().catch(console.error);

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalFilters(new AllExceptionsFilter());

  startExpireBansJob();

  await app.listen(env.port);
  console.log(`Backend running on port ${env.port}`);
}

bootstrap().catch((error) => {
  console.error('BACKEND_BOOTSTRAP_FAILED', error);
  process.exit(1);
});
