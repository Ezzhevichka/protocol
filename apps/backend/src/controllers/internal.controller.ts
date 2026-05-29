import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LiveServerSnapshot } from '@squad-admin/shared';

import { InternalTokenGuard } from '../guards/internal-token.guard';
import { getBanStatus } from '../services/bans.service';
import { closePlayerSession, openPlayerSession } from '../services/player-identity.service';
import { savePlayersSnapshot } from '../services/player-snapshot.service';

@Controller('internal')
@UseGuards(InternalTokenGuard)
export class InternalController {
  @Get('bans/check/:steamId')
  async checkBan(
    @Param('steamId') steamId: string,
    @Query('eosId') eosId?: string,
    @Query('name') nickname?: string
  ) {
    return getBanStatus({ steamId, eosId, nickname });
  }

  @Post('events/player-connected')
  async openPlayer(@Body() body: any) {
    return openPlayerSession({
      serverId: Number(body.serverId),
      steamId: String(body.steamId),
      eosId: body.eosId ?? null,
      name: body.name ?? null,
      raw: body.raw ?? null,
    });
  }

  @Post('events/player-disconnected')
  async closePlayer(@Body() body: any) {
    const session = await closePlayerSession({
      serverId: Number(body.serverId),
      steamId: String(body.steamId),
      raw: body.raw ?? null,
    });

    return { session };
  }

  @Post('players/snapshot')
  async savePlayers(@Body() body: LiveServerSnapshot) {
    return savePlayersSnapshot({
      serverId: Number(body.serverId),
      players: Array.isArray(body.players) ? body.players : [],
      squads: Array.isArray(body.squads) ? body.squads : [],
      server: body.server,
      version: Number(body.version) || Date.now(),
      updatedAt: body.updatedAt ?? new Date().toISOString(),
      source: body.source ?? 'manual',
      stale: Boolean(body.stale),
      error: body.error ?? null,
      serverName: body.serverName,
      teamOne: body.teamOne,
      teamTwo: body.teamTwo,
    });
  }
}
