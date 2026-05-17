/* ── Auth ───────────────────────────────────────────────────── */

export type AuthUser = {
  id: string;
  steamId: string;
  displayName: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  role: string | null;
};

/* ── Domain Types ──────────────────────────────────────────── */

export type Player = {
  id?: string | number;
  kitName?: string;
  kitIcon?: string;
  nickname: string;
  caption?: string;
  role?: string;
  hashNumber?: string | number;
};

export type Squad = {
  id?: string | number;
  squadNumber: string | number;
  squadName: string;
  playersInSquad: string | number;
  isOpen?: boolean;
  hasCmd?: boolean;
  players: Player[];
};

export type FractionData = {
  hoursAmount: number | string;
  fractionName: string;
  playersAmount: string | number;
  flag: string;
  doctrine?: string;
  squads: Squad[];
  notSquadPlayers?: Player[];
};

export type ServerStatusState = "default" | "pressed" | "disabled";

export type ServerData = {
  id?: string | number;
  slot?: number;
  badge?: string | number;
  name?: string;
  state?: ServerStatusState;
  playersCount?: number | string;
  queueCount?: number;
  maxPlayers?: number;
  onClick?: () => void;
};

export type ServerLevelType = "empty" | "frog" | "casual" | "sweaty" | "nightmare";

export type MapData = {
  mapName: string;
  imageSrc?: string;
};

export type ServerStateData = {
  level: ServerLevelType;
  hoursAmount: number | string;
  openProfilePercentages: number | string;
};

export type StatPlayer = {
  rank: number;
  nickname: string;
  hoursText: string;
};

export type StatCard = {
  id?: string | number;
  iconSrc: string;
  title: string;
  players: StatPlayer[];
};
