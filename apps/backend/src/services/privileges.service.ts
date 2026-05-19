import { prisma } from '@squad-admin/database';

import type {
    CreatePrivilegeInput,
    UpdatePrivilegeGroupInput,
    UpdatePrivilegeInput,
} from '../schemas/privileges.schema';

async function resolveGroupByKey(groupKey: string) {
    const group = await prisma.privilegeGroup.findUnique({
        where: {
            key: groupKey,
        },
    });

    if (!group) {
        const error = new Error('PRIVILEGE_GROUP_NOT_FOUND');
        error.name = 'PRIVILEGE_GROUP_NOT_FOUND';
        throw error;
    }

    return group;
}

export async function listPrivilegeGroups() {
    return prisma.privilegeGroup.findMany({
        orderBy: {
            label: 'asc',
        },
    });
}

export async function updatePrivilegeGroup(id: string, input: UpdatePrivilegeGroupInput) {
    return prisma.privilegeGroup.update({
        where: {
            id,
        },
        data: {
            key: input.key,
            label: input.label,
            color: input.color,
            permissions: input.permissions,
        },
    });
}

export async function listPrivileges() {
    return prisma.playerPrivilege.findMany({
        include: {
            group: true,
        },
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
    });
}

export async function createPrivilege(input: CreatePrivilegeInput) {
    const group = await resolveGroupByKey(input.groupKey);

    return prisma.playerPrivilege.create({
        data: {
            steamId: input.steamId ?? null,
            eosId: input.eosId ?? null,
            nickname: input.nickname ?? null,

            groupId: group.id,

            comment: input.comment ?? null,
            prefix: input.prefix ?? null,
            prefixColor: input.prefixColor ?? null,
            imageUrl: input.imageUrl ?? null,

            active: true,
        },
        include: {
            group: true,
        },
    });
}

export async function updatePrivilege(id: string, input: UpdatePrivilegeInput) {
    const group = input.groupKey ? await resolveGroupByKey(input.groupKey) : null;

    return prisma.playerPrivilege.update({
        where: {
            id,
        },
        data: {
            steamId: input.steamId,
            eosId: input.eosId,
            nickname: input.nickname,

            groupId: group?.id,

            comment: input.comment,
            prefix: input.prefix,
            prefixColor: input.prefixColor,
            imageUrl: input.imageUrl,
        },
        include: {
            group: true,
        },
    });
}

export async function deletePrivilege(id: string) {
    return prisma.playerPrivilege.delete({
        where: {
            id,
        },
    });
}

export async function getPrivilegesForPlayer(input: {
    steamId?: string;
    eosId?: string;
    nickname?: string;
}) {
    return prisma.playerPrivilege.findMany({
        where: {
            active: true,
            OR: [
                input.steamId ? { steamId: input.steamId } : undefined,
                input.eosId ? { eosId: input.eosId } : undefined,
                input.nickname ? { nickname: input.nickname } : undefined,
            ].filter(Boolean) as any,
        },
        include: {
            group: true,
        },
    });
}
