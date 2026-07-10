import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFiles = [
	resolve(__dirname, '../.env'),
	resolve(__dirname, '../../../shared/database/.env'),
];

for (const file of envFiles) {
	if (existsSync(file)) {
		loadEnv({ path: file, override: false });
	}
}
