/*
  Warnings:

  - A unique constraint covering the columns `[discord]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Punishments" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "discord" TEXT;

-- CreateTable
CREATE TABLE "Nicknames" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL,

    CONSTRAINT "Nicknames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "eosId" TEXT NOT NULL,
    "playedHours" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nicknames_steamId_key" ON "Nicknames"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "Players_steamId_key" ON "Players"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "Players_eosId_key" ON "Players"("eosId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_discord_key" ON "Users"("discord");
