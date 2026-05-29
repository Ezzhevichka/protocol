import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import { createWarnSchema } from '../schemas/punishments.schema';
import { createWarn, listWarns } from '../services/punishments.service';

@Controller('punishments')
@UseGuards(SessionAuthGuard)
export class PunishmentsController {
  @Get('warns')
  async warns(@Query('q') q?: string) {
    return { warns: await listWarns(q) };
  }

  @Post('warns')
  async createWarn(@Body(new ZodValidationPipe(createWarnSchema)) body: unknown) {
    return { warn: await createWarn(body as never) };
  }
}
