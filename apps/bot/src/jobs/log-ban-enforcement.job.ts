import { banEnforcementHandler, playerSessionHandler, playerSnapshotHandler } from 'events/handlers';
import { tailLocalLogFile } from 'services/log-tail.service';
import { tailRemoteLogOverSsh } from 'services/remote-ssh-tail.service';
import { emitPlayerEvent, registerEventHandler } from 'utils/event-bus';
import { parseSquadLogLine } from 'utils/parsers';

let started = false;

async function handleLine(line: string) {
  const event = parseSquadLogLine(line);
  if (!event) { return; }

  await emitPlayerEvent(event);
}

export function startLogBanEnforcementJob() {
  if (started) { return; }
  started = true;

  registerEventHandler(playerSnapshotHandler);
  registerEventHandler(playerSessionHandler);
  registerEventHandler(banEnforcementHandler);

  if (process.env.LOG_TAIL_MODE === 'local') {
    tailLocalLogFile(process.env.SQUAD_LOG_PATH!, handleLine);
    return;
  }

  tailRemoteLogOverSsh(
    {
      host: process.env.SSH_HOST ?? '',
      port: Number(process.env.SSH_PORT),
      username: process.env.SSH_USERNAME!,
      password: process.env.SSH_PASSWORD!,
      path: process.env.SQUAD_LOG_PATH!,
    },
    handleLine
  );
}
