function numericSort(a: string, b: string) {
  const na = Number(a);
  const nb = Number(b);

  if (Number.isFinite(na) && Number.isFinite(nb)) {
    return na - nb;
  }

  return a.localeCompare(b);
}

function isCommandSquad(name?: string | null) {
  if (!name) { return false; }

  const normalized = name.toLowerCase();

  return (
    normalized.includes('cmd') || normalized.includes('command') || normalized.includes('команд')
  );
}

export function groupPlayersByTeams(input: { players: any[]; squads: any[] }) {
  const squadMap = new Map<string, any>();

  for (const squad of input.squads) {
    squadMap.set(`${squad.teamId}:${squad.squadId}`, squad);
  }

  const result: Record<
    string,
    {
      squads: Array<{
        squad: any;
        players: any[];
      }>;
      unassigned: any[];
    }
  > = {};

  for (const player of input.players) {
    const teamId = String(player.raw?.teamID ?? 'unknown');
    const squadId = player.raw?.squadID == null ? null : String(player.raw.squadID);

    result[teamId] ??= {
      squads: [],
      unassigned: [],
    };

    if (!squadId) {
      result[teamId].unassigned.push(player);
      continue;
    }

    let group = result[teamId].squads.find((item) => item.squad.squadId === squadId);

    if (!group) {
      group = {
        squad: squadMap.get(`${teamId}:${squadId}`) ?? {
          squadId,
          teamId,
          name: `Squad ${squadId}`,
        },
        players: [],
      };

      result[teamId].squads.push(group);
    }

    group.players.push(player);
  }

  return Object.entries(result)
    .sort(([a], [b]) => numericSort(a, b))
    .map(([teamId, team]) => ({
      teamId,
      squads: team.squads
        .map((squadGroup) => ({
          ...squadGroup,
          players: squadGroup.players.sort(
            (a, b) =>
              Number(Boolean(b.raw?.isLeader)) - Number(Boolean(a.raw?.isLeader))
              || a.name.localeCompare(b.name)
          ),
        }))
        .sort(
          (a, b) =>
            Number(isCommandSquad(b.squad.name)) - Number(isCommandSquad(a.squad.name))
            || numericSort(a.squad.squadId, b.squad.squadId)
        ),
      unassigned: team.unassigned.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}
