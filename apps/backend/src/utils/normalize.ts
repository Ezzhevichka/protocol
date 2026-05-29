import { BanTargetType } from '@squad-admin/database';

export function normalizeSteamId(value: string) {
  return value.trim();
}

export function normalizeEosId(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeBanTarget(targetType: BanTargetType, value: string) {
  if (targetType === BanTargetType.STEAM_ID) { return normalizeSteamId(value); }
  return normalizeEosId(value);
}
