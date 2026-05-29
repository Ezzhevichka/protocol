import * as fs from 'fs';
import * as path from 'path';

const ADMIN_GROUPS = new Set(['Admin', 'Moderator']);

let cachedAdminIds: Set<string> | null = null;

function parseAdminsCfg(filePath: string): Set<string> {
    const adminIds = new Set<string>();

    let content: string;
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch {
        console.warn(`[admins] Admins.cfg not found at ${filePath}`);
        return adminIds;
    }

    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('Admin=')) continue;

        // Format: Admin=76561198000000000:GroupName
        const rest = trimmed.slice('Admin='.length);
        const colonIdx = rest.lastIndexOf(':');
        if (colonIdx === -1) continue;

        const steamId = rest.slice(0, colonIdx).trim();
        const group = rest.slice(colonIdx + 1).trim();

        if (ADMIN_GROUPS.has(group)) {
            adminIds.add(steamId);
        }
    }

    return adminIds;
}

export function getAdminSteamIds(): Set<string> {
    if (cachedAdminIds) return cachedAdminIds;

    // Works from src/services/ (dev) and dist/services/ (prod)
    const cfgPath = path.resolve(__dirname, '../../Admins.cfg');
    cachedAdminIds = parseAdminsCfg(cfgPath);

    console.log(`[admins] Loaded ${cachedAdminIds.size} admin/moderator Steam IDs`);
    return cachedAdminIds;
}

export function isAdminSteamId(steamId: string): boolean {
    return getAdminSteamIds().has(steamId);
}
