import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { SessionAuthGuard } from '../guards/session-auth.guard';
import { getPlayerProfileBySteamId, listKnownPlayers } from '../services/player-identity.service';
import { getDefaultPlayers, getPlayersByServerId } from '../services/players.service';
import { refreshSteamProfile } from '../services/steam.service';

@Controller()
@UseGuards(SessionAuthGuard)
export class PlayersController {
  @Get('players')
  async defaultPlayers() {
    return getDefaultPlayers();
  }

  @Get('players/known')
  async known(@Query('q') q?: string) {
    return { players: await listKnownPlayers(q) };
  }

  @Get('players/:steamId/profile')
  async profile(@Param('steamId') steamId: string) {
    const [profile, steamProfile] = await Promise.all([
      getPlayerProfileBySteamId(steamId),
      refreshSteamProfile(steamId).catch((error) => ({
        error: error instanceof Error ? error.message : String(error),
      })),
    ]);

    return { player: profile, steamProfile };
  }

  @Get('servers/:serverId/players')
  async serverPlayers(@Param('serverId') serverIdParam: string) {
    return getPlayersByServerId(Number(serverIdParam));
  }
}
