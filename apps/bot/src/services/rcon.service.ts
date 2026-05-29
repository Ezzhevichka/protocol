import { createRconApi, type RconApi, type RconExecuteOptions } from './rcon';
import { isConnectionResetError } from './rcon/errors';

let api: RconApi | null = null;
let generation = 0;

const getRcon = () => {
  if (!api) {
    api = createRconApi();
  }
  return api;
};

const resetRcon = async (target?: RconApi) => {
  generation += 1;
  const current = target ?? api;

  if (target && api !== target) {
    await target.close().catch(() => undefined);
    return;
  }

  api = null;
  await current?.close().catch(() => undefined);
};

export const withRcon = async <T>(
  task: (rcon: RconApi) => Promise<T>,
  options?: RconExecuteOptions & { resetOnError?: boolean }
): Promise<T> => {
  const currentGeneration = generation;
  const rcon = getRcon();

  try {
    if (currentGeneration !== generation) {
      throw new Error('RCON generation changed before command execution');
    }
    return await task(rcon);
  } catch (error) {
    const shouldReset = options?.resetOnError ?? isConnectionResetError(error);
    if (shouldReset) { await resetRcon(rcon); }
    throw error;
  }
};

export const getRconHealth = () => getRcon().health();
export const closeRcon = async () => resetRcon();
