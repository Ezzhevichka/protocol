import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { BansController } from './controllers/bans.controller';
import { HealthController } from './controllers/health.controller';
import { InternalController } from './controllers/internal.controller';
import { MeController } from './controllers/me.controller';
import { NicknameBlacklistController } from './controllers/nickname-blacklist.controller';
import { PlayersController } from './controllers/players.controller';
import { PrivilegesController } from './controllers/privileges.controller';
import { PunishmentsController } from './controllers/punishments.controller';
import { RemoteBotController } from './controllers/remote-bot.controller';
import { ServersController } from './controllers/servers.controller';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { InternalTokenGuard } from './guards/internal-token.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';

@Module({
  controllers: [
    AuthController,
    BansController,
    HealthController,
    InternalController,
    MeController,
    NicknameBlacklistController,
    PlayersController,
    PrivilegesController,
    PunishmentsController,
    RemoteBotController,
    ServersController,
  ],
  providers: [AllExceptionsFilter, InternalTokenGuard, SessionAuthGuard],
})
export class AppModule {}
