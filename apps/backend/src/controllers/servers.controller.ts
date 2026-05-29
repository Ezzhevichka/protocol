import { Controller, Get, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../guards/session-auth.guard';
import { listActiveServersInfo } from '../services/servers.service';

@Controller('servers')
@UseGuards(SessionAuthGuard)
export class ServersController {
  @Get()
  async list() {
    return { servers: await listActiveServersInfo() };
  }
}
