export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) { throw new Error(`${name} is required`); }
  return value;
}

export function numberEnv(name: string, fallback?: number): number {
  const raw = process.env[name];
  if (!raw && fallback !== undefined) { return fallback; }
  if (!raw) { throw new Error(`${name} is required`); }
  const value = Number(raw);
  if (Number.isNaN(value)) { throw new Error(`${name} must be a number. Received: ${raw}`); }
  return value;
}
