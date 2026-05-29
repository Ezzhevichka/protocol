import { SquadInfo } from '@squad-admin/shared';

import { RconCommandKind } from 'services/rcon';

import { withRcon } from '../rcon.service';

export const getSquadsFromRcon = async (): Promise<SquadInfo[]> => {
  return withRcon(async (rcon) => {
    const squads = await rcon.getListSquads({ timeoutMs: 3_000 });

    return squads.map((squad) => ({
      squadId: squad.squadID,
      teamId: squad.teamID,
      name: squad.squadName,
      size: parseInt(squad.size, 10),
      locked: Boolean(squad.locked),
      creatorName: squad.creatorName ?? '',
      creatorEOSId: squad.creatorEOSID ?? '',
      creatorSteamId: squad.creatorSteamID ?? '',
      teamName: squad.teamName ?? null,
    }));
  }, { kind: RconCommandKind.READ, timeoutMs: 3_000 });
};
