-- CreateEnum
CREATE TYPE "SquadPermissions" AS ENUM ('startvote', 'changemap', 'pause', 'cheat', 'private', 'balance', 'chat', 'kick', 'ban', 'config', 'cameraman', 'manageserver', 'featuretest', 'reserve', 'demos', 'clientdemos', 'debug', 'teamchange', 'forceteamchange', 'canseeadminchat');

-- CreateEnum
CREATE TYPE "SitePermissions" AS ENUM ('ban', 'kick');

-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('BAN', 'WARN');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "squad_permissions" "SquadPermissions"[],
    "site_permissions" "SitePermissions"[],

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "steam_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "punishments" (
    "id" TEXT NOT NULL,
    "punishment_type" "PunishmentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issued_until" TIMESTAMP(3),
    "description" TEXT,
    "reason" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "victim" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "punishments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_steam_id_key" ON "users"("steam_id");
