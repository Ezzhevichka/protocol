export type RconErrorCode
  = | 'RCON_CONFIG_ERROR'
    | 'RCON_CONNECTION_ERROR'
    | 'RCON_AUTH_ERROR'
    | 'RCON_TIMEOUT'
    | 'RCON_DISCONNECTED'
    | 'RCON_PROTOCOL_ERROR'
    | 'RCON_QUEUE_FULL'
    | 'RCON_COMMAND_REJECTED';

export type RconError = Error & {
  code: RconErrorCode;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export const makeRconError = (
  code: RconErrorCode,
  message: string,
  details?: Record<string, unknown>,
  cause?: unknown
): RconError => {
  const error = new Error(message) as RconError;
  error.name = code;
  error.code = code;
  error.details = details;
  error.cause = cause;
  return error;
};

export const isRconError = (error: unknown): error is RconError => {
  return error instanceof Error && 'code' in error;
};

export const isConnectionResetError = (error: unknown): boolean => {
  if (isRconError(error)) {
    return ['RCON_CONNECTION_ERROR', 'RCON_TIMEOUT', 'RCON_DISCONNECTED', 'RCON_PROTOCOL_ERROR'].includes(error.code);
  }

  if (!(error instanceof Error)) {
    return true;
  }

  const message = error.message.toLowerCase();
  return [
    'timeout',
    'closed',
    'socket',
    'econnreset',
    'econnrefused',
    'not connected',
    'connection',
    'broken pipe',
  ].some((item) => message.includes(item));
};
