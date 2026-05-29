import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../guards/session-auth.guard';

import type { Request } from 'express';

@Controller('me')
@UseGuards(SessionAuthGuard)
export class MeController {
  @Get()
  me(@Req() req: Request) {
    return { user: req.user ?? null };
  }
}
