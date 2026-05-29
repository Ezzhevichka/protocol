import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import { createNicknameBlacklistSchema } from '../schemas/nickname-blacklist.schema';
import {
  addNicknameToBlacklist,
  listNicknameBlacklist,
  removeNicknameFromBlacklist,
} from '../services/nickname-blacklist.service';

@Controller('nickname-blacklist')
@UseGuards(SessionAuthGuard)
export class NicknameBlacklistController {
  @Get()
  async list() {
    return { nicknames: await listNicknameBlacklist() };
  }

  @Post()
  async add(@Body(new ZodValidationPipe(createNicknameBlacklistSchema)) body: { nickname: string }) {
    return { item: await addNicknameToBlacklist(body.nickname) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await removeNicknameFromBlacklist(id);
    return { ok: true };
  }
}
