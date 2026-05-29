import { makeRconError } from './errors';

type QueueItem<T> = {
  label: string;
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export type AsyncQueue = {
  add<T>(label: string, run: () => Promise<T>): Promise<T>;
  size(): number;
  active(): number;
};

export const createAsyncQueue = (input: { name: string; concurrency: number; maxSize: number }): AsyncQueue => {
  let active = 0;
  const items: QueueItem<unknown>[] = [];

  const pump = () => {
    while (active < input.concurrency && items.length > 0) {
      const item = items.shift();
      if (!item) { return; }

      active += 1;
      item.run()
        .then(item.resolve)
        .catch(item.reject)
        .finally(() => {
          active -= 1;
          pump();
        });
    }
  };

  return {
    async add<T>(label: string, run: () => Promise<T>) {
      if (items.length >= input.maxSize) {
        return Promise.reject(makeRconError('RCON_QUEUE_FULL', `${input.name} queue is full`, {
          queue: input.name,
          label,
          maxSize: input.maxSize,
        }));
      }

      return new Promise<T>((resolve, reject) => {
        items.push({ label, run, resolve: resolve as (value: unknown) => void, reject });
        pump();
      });
    },
    size: () => items.length,
    active: () => active,
  };
};
