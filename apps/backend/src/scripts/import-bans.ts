// backend/scripts/import-bans.ts

import 'dotenv/config';
import { prisma } from '@squad-admin/database';
import { BanStatus, BanTargetType } from '@squad-admin/database';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), process.argv[2] ?? 'Bans.cfg');
const MAX_TEMP_BAN_SECONDS = 60 * 60 * 24 * 365 * 5;

function resolveExpiresAt(duration: number) {
    if (duration === 0) return null;
    if (duration > MAX_TEMP_BAN_SECONDS) return null;
    return new Date(Date.now() + duration * 1000);
}

function parseLine(line: string) {
    const match = line.match(/^\s*(7656119\d{10})\s*:\s*(\d+)\s*(?:\/\/\s*(.*))?\s*$/);

    if (!match) return null;

    const steamId = match[1];
    const duration = Number(match[2]);
    const reason = match[3]?.trim() || 'Imported from Bans.cfg';

    return {
        steamId,
        duration,
        reason,
    };
}

async function main() {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    let imported = 0;
    let skipped = 0;

    for (const line of lines) {
        if (!line.trim()) continue;

        const parsed = parseLine(line);

        if (!parsed) {
            skipped++;
            console.warn('SKIPPED_INVALID_LINE:', line);
            continue;
        }

        const existing = await prisma.ban.findFirst({
            where: {
                targetType: BanTargetType.STEAM_ID,
                normalizedTargetValue: parsed.steamId,
                status: BanStatus.ACTIVE,
            },
        });

        if (existing) {
            skipped++;
            continue;
        }

        await prisma.ban.create({
            data: {
                targetType: BanTargetType.STEAM_ID,
                targetValue: parsed.steamId,
                normalizedTargetValue: parsed.steamId,
                reason: parsed.reason,
                status: BanStatus.ACTIVE,
                expiresAt: resolveExpiresAt(parsed.duration),
                createdById: 'import',
                createdByName: 'Bans.cfg import',
            },
        });

        imported++;
    }

    console.log({
        imported,
        skipped,
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
