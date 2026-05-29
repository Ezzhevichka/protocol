import fs from 'fs';

import chokidar from 'chokidar';

type LineHandler = (line: string) => void | Promise<void>;

export function tailLocalLogFile(filePath: string, onLine: LineHandler) {
  let position = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
  let buffer = '';

  async function readNewChunk() {
    if (!fs.existsSync(filePath)) { return; }
    const stat = fs.statSync(filePath);

    if (stat.size < position) {
      position = 0;
      buffer = '';
    }

    if (stat.size === position) { return; }

    const stream = fs.createReadStream(filePath, {
      start: position,
      end: stat.size,
      encoding: 'utf8',
    });
    position = stat.size;

    for await (const chunk of stream) {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) { await onLine(trimmed); }
      }
    }
  }

  const watcher = chokidar.watch(filePath, { ignoreInitial: true });
  watcher.on('change', async () =>
    readNewChunk().catch((error) => console.error('LOCAL_LOG_TAIL_FAILED', error))
  );
  return watcher;
}
