import { getRconConfig } from './config';
import { createRconConnection } from './connection';
import { parseListPlayers, parseListSquads, parseServerInfo } from './parsers';
import { createAsyncQueue } from './queue';
import { RconApi, RconCommandKind, RconExecuteOptions } from './types';

const mutationCommandPattern = /^(AdminKick|AdminBan|AdminWarn|AdminBroadcast|AdminForceTeamChange|AdminRemovePlayerFromSquad|AdminDemoteCommander|AdminRestartMatch|AdminEndMatch|AdminSetNextLayer|AdminChangeLayer|AdminSlomo|AdminForceAllRoleAvailability|AdminDisableVehicleClaiming|AdminAlwaysValidPlacement|AdminNetTestStart|AdminNetTestStop)\b/i;
const readCommandPattern = /^(ListPlayers|ListSquads|ShowServerInfo|ShowCurrentMap|ShowNextMap|ShowNextLayer|ListCommands|AdminListDisconnectedPlayers)\b/i;

const classifyCommand = (command: string, explicit?: RconCommandKind): RconCommandKind => {
  if (explicit) { return explicit; }
  const trimmed = command.trim();
  if (mutationCommandPattern.test(trimmed)) { return RconCommandKind.MUTATION; }
  if (readCommandPattern.test(trimmed)) { return RconCommandKind.READ; }
  return RconCommandKind.MUTATION;
};

export const createRconApi = (): RconApi => {
  const config = getRconConfig();
  const connection = createRconConnection(config);
  const readQueue = createAsyncQueue({ name: 'rcon:read', concurrency: 1, maxSize: config.maxQueueSize });
  const mutationQueue = createAsyncQueue({ name: 'rcon:mutation', concurrency: 1, maxSize: Math.max(25, Math.floor(config.maxQueueSize / 2)) });
  const transportQueue = createAsyncQueue({ name: 'rcon:transport', concurrency: 1, maxSize: config.maxQueueSize });

  const executeThroughTransport = async (command: string, options?: RconExecuteOptions) => {
    const label = options?.label ?? command.slice(0, 80);
    return transportQueue.add(label, async () => connection.executeRaw(command, options?.timeoutMs));
  };

  const execute = async (command: string, options?: RconExecuteOptions) => {
    const kind = classifyCommand(command, options?.kind);
    const label = options?.label ?? command.slice(0, 80);

    if (kind === 'read') {
      return readQueue.add(label, async () => executeThroughTransport(command, { ...options, kind }));
    }

    return mutationQueue.add(label, async () => executeThroughTransport(command, { ...options, kind }));
  };

  return {
    execute,
    read: async (command, options) => execute(command, { ...options, kind: RconCommandKind.READ }),
    mutate: async (command, options) => execute(command, { ...options, kind: RconCommandKind.MUTATION }),
    getListPlayers: async (options) => parseListPlayers(await execute('ListPlayers', { ...options, kind: RconCommandKind.READ, label: 'ListPlayers' })),
    getListSquads: async (options) => parseListSquads(await execute('ListSquads', { ...options, kind: RconCommandKind.READ, label: 'ListSquads' })),
    getServerInfo: async (options) => parseServerInfo(await execute('ShowServerInfo', { ...options, kind: RconCommandKind.READ, label: 'ShowServerInfo' })),
    health: () => connection.health({ readQueue: readQueue.size() + transportQueue.size(), mutationQueue: mutationQueue.size() }),
    close: async () => connection.close(),
  };
};
