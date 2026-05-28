import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/client';

// Загружаем .env до создания клиента
const envFiles = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '../../apps/backend/.env'),
];
for (const file of envFiles) {
    if (existsSync(file)) loadEnv({ path: file, override: false });
}

// Клиент создаётся только здесь — после загрузки переменных
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const servers = [
        { id: 1, name: '[RU] INVASION' },
        { id: 2, name: '[RU] SUPERMOD ALL' },
        { id: 3, name: '[RU] AAS' },
        { id: 4, name: '[RU] WARZONE' },
    ];

    for (const server of servers) {
        await prisma.squadServer.upsert({
            where: { id: server.id },
            update: { name: server.name },
            create: server,
        });
        console.log(`✓ Server ${server.id}: ${server.name}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
