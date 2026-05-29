import { client } from './client';

type BanResponse = {
  isBanned: boolean;
  nicknameBlacklisted?: boolean;
  activeBan: Nullable<{ id: string; reason: string }>;
};

export const checkBanBySteamId = async (input: { steamId: string; eosId?: Nullable<string>; name?: Nullable<string> }) => {
  const response = await client.get<BanResponse>(`/internal/bans/check/${input.steamId}`, {
    params: { eosId: input.eosId, name: input.name },
  });

  return response.data;
};
