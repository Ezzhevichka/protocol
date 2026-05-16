/*
  Warnings:

  - The values [NICKNAME] on the enum `BanTargetType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('WARN');

-- CreateEnum
CREATE TYPE "PlayerSessionStatus" AS ENUM ('ONLINE', 'CLOSED', 'STALE');

-- AlterEnum
BEGIN;
CREATE TYPE "BanTargetType_new" AS ENUM ('STEAM_ID', 'EOS_ID');
ALTER TABLE "Ban" ALTER COLUMN "targetType" TYPE "BanTargetType_new" USING ("targetType"::text::"BanTargetType_new");
ALTER TYPE "BanTargetType" RENAME TO "BanTargetType_old";
ALTER TYPE "BanTargetType_new" RENAME TO "BanTargetType";
DROP TYPE "public"."BanTargetType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'CAMERA';
ALTER TYPE "UserRole" ADD VALUE 'TECH_ADMINISTRATOR';
ALTER TYPE "UserRole" ADD VALUE 'INTERN';

-- AlterTable
ALTER TABLE "Ban" ADD COLUMN     "targetNameSnapshot" TEXT;

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "eosId" TEXT,
    "lastName" TEXT,
    "lastSeenServerId" INTEGER,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerName" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timesSeen" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL DEFAULT 'server',

    CONSTRAINT "PlayerName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSession" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "serverId" INTEGER NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnectedAt" TIMESTAMP(3),
    "status" "PlayerSessionStatus" NOT NULL DEFAULT 'ONLINE',
    "connectRaw" TEXT,
    "disconnectRaw" TEXT,
    "lastKnownName" TEXT,
    "lastKnownEosId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerExternalProfile" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "personaName" TEXT,
    "profileUrl" TEXT,
    "avatarUrl" TEXT,
    "countryCode" TEXT,
    "steamCreatedAt" TIMESTAMP(3),
    "squadPlaytimeMin" INTEGER,
    "totalPlaytimeMin" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "raw" JSONB,
    "lastFetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerExternalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Punishment" (
    "id" TEXT NOT NULL,
    "type" "PunishmentType" NOT NULL,
    "playerId" TEXT,
    "steamId" TEXT,
    "eosId" TEXT,
    "nickname" TEXT,
    "reason" TEXT NOT NULL,
    "createdById" TEXT,
    "createdByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Punishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NicknameBlacklist" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NicknameBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_steamId_key" ON "Player"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_eosId_key" ON "Player"("eosId");

-- CreateIndex
CREATE INDEX "Player_lastName_idx" ON "Player"("lastName");

-- CreateIndex
CREATE INDEX "Player_lastSeenServerId_idx" ON "Player"("lastSeenServerId");

-- CreateIndex
CREATE INDEX "PlayerName_nickname_idx" ON "PlayerName"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerName_playerId_nickname_key" ON "PlayerName"("playerId", "nickname");

-- CreateIndex
CREATE INDEX "PlayerSession_playerId_idx" ON "PlayerSession"("playerId");

-- CreateIndex
CREATE INDEX "PlayerSession_serverId_status_idx" ON "PlayerSession"("serverId", "status");

-- CreateIndex
CREATE INDEX "PlayerSession_connectedAt_idx" ON "PlayerSession"("connectedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerExternalProfile_playerId_key" ON "PlayerExternalProfile"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerExternalProfile_steamId_key" ON "PlayerExternalProfile"("steamId");

-- CreateIndex
CREATE INDEX "Punishment_type_idx" ON "Punishment"("type");

-- CreateIndex
CREATE INDEX "Punishment_steamId_idx" ON "Punishment"("steamId");

-- CreateIndex
CREATE INDEX "Punishment_eosId_idx" ON "Punishment"("eosId");

-- CreateIndex
CREATE INDEX "Punishment_nickname_idx" ON "Punishment"("nickname");

-- CreateIndex
CREATE INDEX "Punishment_createdAt_idx" ON "Punishment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NicknameBlacklist_nickname_key" ON "NicknameBlacklist"("nickname");

-- AddForeignKey
ALTER TABLE "PlayerName" ADD CONSTRAINT "PlayerName_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSession" ADD CONSTRAINT "PlayerSession_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerExternalProfile" ADD CONSTRAINT "PlayerExternalProfile_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
