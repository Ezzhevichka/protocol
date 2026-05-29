import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import {
  createPrivilegeSchema,
  updatePrivilegeGroupSchema,
  updatePrivilegeSchema,
} from '../schemas/privileges.schema';
import {
  createPrivilege,
  deletePrivilege,
  listPrivilegeGroups,
  listPrivileges,
  updatePrivilege,
  updatePrivilegeGroup,
} from '../services/privileges.service';

@Controller('privileges')
@UseGuards(SessionAuthGuard)
export class PrivilegesController {
  @Get('groups')
  async groups() {
    return { groups: await listPrivilegeGroups() };
  }

  @Patch('groups/:id')
  async updateGroup(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePrivilegeGroupSchema)) body: unknown
  ) {
    return { group: await updatePrivilegeGroup(id, body as never) };
  }

  @Get('players')
  async players() {
    return { privileges: await listPrivileges() };
  }

  @Post('players')
  async create(@Body(new ZodValidationPipe(createPrivilegeSchema)) body: unknown) {
    return { privilege: await createPrivilege(body as never) };
  }

  @Patch('players/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePrivilegeSchema)) body: unknown
  ) {
    return { privilege: await updatePrivilege(id, body as never) };
  }

  @Delete('players/:id')
  async delete(@Param('id') id: string) {
    await deletePrivilege(id);
    return { ok: true };
  }
}
