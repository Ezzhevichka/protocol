import { prisma } from '@squad-admin/database';

import { getBotEndpointConfig } from '../config/bots';

export type SquadServerConfig = {
    id: number;
    name: string;
    botUrl: string;
    botToken: string;
};

export async function listSquadServerConfigs(): Promise<SquadServerConfig[]> {
    const servers = await prisma.squadServer.findMany({
        orderBy: {
            id: 'asc',
        },
    });

    return servers.map((server) => {
        const bot = getBotEndpointConfig(server.id);

        return {
            id: server.id,
            name: server.name,
            botUrl: bot.botUrl,
            botToken: bot.botToken,
        };
    });
}

export async function getSquadServerConfig(serverId: number): Promise<SquadServerConfig | null> {
    const server = await prisma.squadServer.findUnique({
        where: {
            id: serverId,
        },
    });

    if (!server) {
        return null;
    }

    const bot = getBotEndpointConfig(server.id);

    return {
        id: server.id,
        name: server.name,
        botUrl: bot.botUrl,
        botToken: bot.botToken,
    };
}

export async function listActiveServersInfo() {
    const servers = await listSquadServerConfigs();

    const results = await Promise.all(
        servers.map(async (server) => {
            try {
                const response = await fetch(`${server.botUrl}/server`, {
                    headers: {
                        Authorization: `Bearer ${server.botToken}`,
                    },
                    signal: AbortSignal.timeout(10_000),
                });

                if (!response.ok) {
                    return {
                        id: server.id,
                        name: server.name,
                        active: false,
                        reason: `Bot responded with ${response.status}`,
                    };
                }

                const data = await response.json();

                return {
                    id: server.id,
                    name: server.name,
                    ...data.server,
                    serverName: undefined,
                };
            } catch (error) {
                return {
                    id: server.id,
                    name: server.name,
                    active: false,
                    reason: error instanceof Error ? error.message : String(error),
                };
            }
        })
    );

    return results;
}
