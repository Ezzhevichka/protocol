-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VIP', 'MODERATOR', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "BanTargetType" AS ENUM ('STEAM_ID', 'NICKNAME');

-- CreateEnum
CREATE TYPE "BanStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "profileUrl" TEXT,
    "role" "UserRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" TEXT NOT NULL,
    "targetType" "BanTargetType" NOT NULL,
    "targetValue" TEXT NOT NULL,
    "normalizedTargetValue" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "BanStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdByName" TEXT,
    "revokedById" TEXT,
    "revokedByName" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");

-- CreateIndex
CREATE INDEX "Ban_targetType_normalizedTargetValue_idx" ON "Ban"("targetType", "normalizedTargetValue");

-- CreateIndex
CREATE INDEX "Ban_status_idx" ON "Ban"("status");

-- CreateIndex
CREATE INDEX "Ban_expiresAt_idx" ON "Ban"("expiresAt");
