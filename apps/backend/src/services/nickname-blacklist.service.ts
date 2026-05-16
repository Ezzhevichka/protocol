import { prisma } from "@squad-admin/database";

export async function listNicknameBlacklist() {
  return prisma.nicknameBlacklist.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addNicknameToBlacklist(nickname: string) {
  return prisma.nicknameBlacklist.upsert({
    where: { nickname },
    create: { nickname },
    update: {},
  });
}

export async function removeNicknameFromBlacklist(id: string) {
  return prisma.nicknameBlacklist.delete({ where: { id } });
}

export async function isNicknameBlacklisted(nickname?: string | null) {
  if (!nickname) return false;
  const item = await prisma.nicknameBlacklist.findUnique({ where: { nickname } });
  return Boolean(item);
}
