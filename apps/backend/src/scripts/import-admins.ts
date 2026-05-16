import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "@squad-admin/database";

const filePath = path.resolve(process.cwd(), process.argv[2] ?? "Admins.cfg");

function parseAdminsCfg(content: string) {
  const groups = new Map<string, string[]>();
  const admins: Array<{ steamId: string; groupCode: string }> = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("//")) continue;

    const groupMatch = line.match(/^Group=([^:]+):(.+)$/i);
    if (groupMatch) {
      groups.set(groupMatch[1].trim(), groupMatch[2].split(",").map((item) => item.trim()).filter(Boolean));
      continue;
    }

    const adminMatch = line.match(/^Admin=(7656119\d{10}):(.+)$/i);
    if (adminMatch) {
      admins.push({ steamId: adminMatch[1], groupCode: adminMatch[2].trim() });
    }
  }

  return { groups, admins };
}

function defaultGroupName(key: string) {
  const names: Record<string, string> = {
    Admin: "Администратор",
    Moderator: "Модератор",
    QueuePriority: "VIP",
    Cameraman: "Камерман",
    Intern: "Стажёр",
  };
  return names[key] ?? key;
}

function defaultColor(key: string) {
  const colors: Record<string, string> = {
    Admin: "#ff2e2e",
    Moderator: "#1e98f6",
    QueuePriority: "#ffc229",
    Cameraman: "#22c55e",
    Intern: "#a855f7",
  };
  return colors[key] ?? "#94a3b8";
}

async function main() {
  const content = fs.readFileSync(filePath, "utf8");
  const { groups, admins } = parseAdminsCfg(content);

  let groupsImported = 0;
  let membersImported = 0;

  for (const [key, permissions] of groups) {
    await prisma.privilegeGroup.upsert({
      where: { key },
      create: {
        key,
        label: defaultGroupName(key),
        color: defaultColor(key),
        permissions,
      },
      update: { permissions },
    });
    groupsImported++;
  }

  for (const admin of admins) {
    const group = await prisma.privilegeGroup.findUnique({where: { key: admin.groupCode }});
    if (!group) continue;

    const existing = await prisma.playerPrivilege.findFirst({
      where: {
        steamId: admin.steamId,
        groupId: group.id,
      },
    });

    if (existing) {
      await prisma.playerPrivilege.update({
        where: { id: existing.id },
        data: { active: true },
      });
    } else {
      await prisma.playerPrivilege.create({
        data: {
          steamId: admin.steamId,
          groupId: group.id,
          active: true,
        },
      });
    }
      membersImported++;
  }

  console.log({ groupsImported, membersImported });
}

main().finally(() => prisma.$disconnect());
