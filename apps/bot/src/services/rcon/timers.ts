import { makeRconError } from './errors';

export const delay = async (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

export const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(makeRconError('RCON_TIMEOUT', `${label} timed out after ${timeoutMs}ms`, { timeoutMs, label }));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) { clearTimeout(timer); }
  }
};

export const nextBackoffMs = (attempt: number, baseMs: number, maxMs: number) => {
  const exponential = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * Math.min(250, exponential));
  return exponential + jitter;
};
