import { Controller, Post, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../guards/session-auth.guard';
import { restartRemoteBot } from '../services/remote-bot.service';

@Controller('remote-bot')
@UseGuards(SessionAuthGuard)
export class RemoteBotController {
  @Post('restart')
  async restart() {
    const result = await restartRemoteBot();

    return {
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }
}
