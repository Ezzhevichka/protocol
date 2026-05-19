import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient as PrismaClientConstructor } from './generated/client';
import type { PrismaClient as GeneratedPrismaClient } from './generated/client';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma: GeneratedPrismaClient = new PrismaClientConstructor({
    adapter,
});
