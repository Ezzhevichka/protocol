import { env } from '../config';
import { emitSquadEvent, registerEventHandler } from '../core/events/event-bus';
import { banEnforcementHandler } from '../events/handlers/ban-enforcement.handler';
import { playerSessionHandler } from '../events/handlers/player-session.handler';
import { parseSquadLogLine } from '../events/parsers';
import { tailLocalLogFile } from '../services/log-tail.service';
import { tailRemoteLogOverSsh } from '../services/remote-ssh-tail.service';

let started = false;

async function handleLine(line: string) {
    const event = parseSquadLogLine(line);
    if (!event) return;

    await emitSquadEvent(event);
}

export function startLogBanEnforcementJob() {
    if (started) return;
    started = true;

    registerEventHandler(playerSessionHandler);
    registerEventHandler(banEnforcementHandler);

    if (env.logTailMode === 'local') {
        tailLocalLogFile(env.squadLogPath!, handleLine);
        return;
    }

    tailRemoteLogOverSsh(
        {
            host: env.sshHost!,
            port: env.sshPort,
            username: env.sshUsername!,
            password: env.sshPassword!,
            path: env.squadLogPath!,
        },
        handleLine
    );
}
