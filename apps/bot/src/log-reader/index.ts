import { tailLocalLogFile, tailRemoteLogOverSsh } from './log-parsers';
import { parseLogLine } from './parseLogLine';
import { eventBus } from '../events';

let started = false;

export const handleLogLine = async (line: string) => {
	const event = parseLogLine(line);
	if (event) {
		eventBus.emit(event);
	}
};

export function startLogEventStreamJob() {
	if (started) return;
	started = true;

	if (process.env.LOG_TAIL_MODE === 'local-file') {
		tailLocalLogFile(process.env.SQUAD_LOG_PATH ?? '', handleLogLine);
		return;
	}

	tailRemoteLogOverSsh(
		{
			host: process.env.SSH_HOST ?? '',
			port: Number(process.env.SSH_PORT),
			username: process.env.SSH_USER ?? '',
			password: process.env.SSH_PASSWORD ?? '',
			path: process.env.SQUAD_LOG_PATH ?? '',
		},
		handleLogLine
	);
}
