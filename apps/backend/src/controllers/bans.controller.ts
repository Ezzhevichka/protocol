import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import { createBanSchema, revokeBanSchema } from '../schemas/bans.schema';
import { createBan, getBanStatusBySteamId, listBans, revokeBan } from '../services/bans.service';

@Controller('bans')
@UseGuards(SessionAuthGuard)
export class BansController {
  @Get()
  async list(@Query('status') status?: string) {
    return { bans: await listBans(status) };
  }

  @Get('check/:steamId')
  async check(@Param('steamId') steamId: string) {
    return getBanStatusBySteamId(steamId);
  }

  @Post()
  async create(@Body(new ZodValidationPipe(createBanSchema)) body: unknown) {
    return createBan(body as never);
  }

  @Post(':banId/revoke')
  async revoke(
    @Param('banId') banId: string,
    @Body(new ZodValidationPipe(revokeBanSchema)) body: unknown
  ) {
    return { ban: await revokeBan(banId, body as never) };
  }
}
