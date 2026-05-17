-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'REVOKED', 'OUTDATED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('QUEUED', 'ASSIGNED', 'LAUNCHING', 'SEEDING', 'SWITCHING', 'FINISHED', 'CANCELLED', 'ERROR', 'AGENT_OFFLINE');

-- CreateEnum
CREATE TYPE "SessionSource" AS ENUM ('WEBSITE', 'LOCAL_AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ServerSelectionMode" AS ENUM ('AUTO_ALL', 'SELECTED_SERVERS', 'SINGLE_SERVER');

-- CreateEnum
CREATE TYPE "PostCompletionAction" AS ENUM ('NONE', 'CLOSE_GAME', 'CLOSE_GAME_AND_SHUTDOWN_PC');

-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('PENDING', 'ASSIGNED', 'SEEDED', 'ALREADY_SEEDED', 'SKIPPED', 'FAILED');

-- CreateEnum
CREATE TYPE "SeedCommandType" AS ENUM ('CONNECT_SERVER', 'SWITCH_SERVER', 'FINISH_SESSION', 'PING');

-- CreateEnum
CREATE TYPE "SeedCommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKED', 'FAILED');

-- CreateEnum
CREATE TYPE "RatingEventType" AS ENUM ('MINUTE_SEEDED', 'SERVER_COMPLETED', 'BONUS', 'ADMIN_ADJUSTMENT', 'PENALTY');

-- CreateTable
CREATE TABLE "AgentDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "lastHeartbeatAt" TIMESTAMP(3),
    "agentVersion" TEXT,
    "platform" TEXT,
    "osVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AgentDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadServerSeed" (
    "id" TEXT NOT NULL,
    "serverId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "gamePort" INTEGER NOT NULL,
    "queryPort" INTEGER NOT NULL,
    "seedThreshold" INTEGER NOT NULL DEFAULT 60,
    "lowerHysteresis" INTEGER NOT NULL DEFAULT 55,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastPlayers" INTEGER,
    "lastMaxPlayers" INTEGER,
    "lastMap" TEXT,
    "lastQueryAt" TIMESTAMP(3),
    "lastQueryError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadServerSeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentDeviceId" TEXT NOT NULL,
    "source" "SessionSource" NOT NULL DEFAULT 'WEBSITE',
    "mode" "ServerSelectionMode" NOT NULL DEFAULT 'AUTO_ALL',
    "maxServersToSeed" INTEGER,
    "postCompletionAction" "PostCompletionAction" NOT NULL DEFAULT 'NONE',
    "shutdownDelaySeconds" INTEGER NOT NULL DEFAULT 120,
    "skipUnavailableServers" BOOLEAN NOT NULL DEFAULT true,
    "seededCount" INTEGER NOT NULL DEFAULT 0,
    "ratingPointsEarned" INTEGER NOT NULL DEFAULT 0,
    "ratingMinutesEarned" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'QUEUED',
    "currentServerId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "lastSwitchAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "SeedSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedSessionTarget" (
    "id" TEXT NOT NULL,
    "seedSessionId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "status" "TargetStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3),
    "seededAt" TIMESTAMP(3),
    "skippedAt" TIMESTAMP(3),
    "failReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedSessionTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMetricSeed" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "players" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "map" TEXT,
    "queriedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,

    CONSTRAINT "ServerMetricSeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSeedCommand" (
    "id" TEXT NOT NULL,
    "agentDeviceId" TEXT NOT NULL,
    "sessionId" TEXT,
    "type" "SeedCommandType" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "SeedCommandStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "ackedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "AgentSeedCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedRatingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "totalSeedMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalSeededServers" INTEGER NOT NULL DEFAULT 0,
    "currentSeasonPoints" INTEGER NOT NULL DEFAULT 0,
    "currentSeasonSeedMinutes" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedRatingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedRatingEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedSessionId" TEXT,
    "serverId" TEXT,
    "type" "RatingEventType" NOT NULL,
    "points" INTEGER NOT NULL,
    "minutes" INTEGER,
    "multiplier" DOUBLE PRECISION,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedRatingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedMinuteLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedSessionId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "minuteBucket" TIMESTAMP(3) NOT NULL,
    "pointsAwarded" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedMinuteLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentDevice_tokenHash_key" ON "AgentDevice"("tokenHash");

-- CreateIndex
CREATE INDEX "AgentDevice_userId_idx" ON "AgentDevice"("userId");

-- CreateIndex
CREATE INDEX "AgentDevice_status_idx" ON "AgentDevice"("status");

-- CreateIndex
CREATE INDEX "AgentDevice_lastHeartbeatAt_idx" ON "AgentDevice"("lastHeartbeatAt");

-- CreateIndex
CREATE UNIQUE INDEX "SquadServerSeed_serverId_key" ON "SquadServerSeed"("serverId");

-- CreateIndex
CREATE INDEX "SquadServerSeed_enabled_idx" ON "SquadServerSeed"("enabled");

-- CreateIndex
CREATE INDEX "SquadServerSeed_priority_idx" ON "SquadServerSeed"("priority");

-- CreateIndex
CREATE INDEX "SeedSession_userId_idx" ON "SeedSession"("userId");

-- CreateIndex
CREATE INDEX "SeedSession_agentDeviceId_idx" ON "SeedSession"("agentDeviceId");

-- CreateIndex
CREATE INDEX "SeedSession_status_idx" ON "SeedSession"("status");

-- CreateIndex
CREATE INDEX "SeedSession_startedAt_idx" ON "SeedSession"("startedAt");

-- CreateIndex
CREATE INDEX "SeedSessionTarget_seedSessionId_idx" ON "SeedSessionTarget"("seedSessionId");

-- CreateIndex
CREATE INDEX "SeedSessionTarget_serverId_idx" ON "SeedSessionTarget"("serverId");

-- CreateIndex
CREATE INDEX "SeedSessionTarget_status_idx" ON "SeedSessionTarget"("status");

-- CreateIndex
CREATE INDEX "ServerMetricSeed_serverId_idx" ON "ServerMetricSeed"("serverId");

-- CreateIndex
CREATE INDEX "ServerMetricSeed_queriedAt_idx" ON "ServerMetricSeed"("queriedAt");

-- CreateIndex
CREATE INDEX "AgentSeedCommand_agentDeviceId_idx" ON "AgentSeedCommand"("agentDeviceId");

-- CreateIndex
CREATE INDEX "AgentSeedCommand_sessionId_idx" ON "AgentSeedCommand"("sessionId");

-- CreateIndex
CREATE INDEX "AgentSeedCommand_status_idx" ON "AgentSeedCommand"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SeedRatingProfile_userId_key" ON "SeedRatingProfile"("userId");

-- CreateIndex
CREATE INDEX "SeedRatingEvent_userId_idx" ON "SeedRatingEvent"("userId");

-- CreateIndex
CREATE INDEX "SeedRatingEvent_seedSessionId_idx" ON "SeedRatingEvent"("seedSessionId");

-- CreateIndex
CREATE INDEX "SeedRatingEvent_createdAt_idx" ON "SeedRatingEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SeedMinuteLedger_userId_idx" ON "SeedMinuteLedger"("userId");

-- CreateIndex
CREATE INDEX "SeedMinuteLedger_seedSessionId_idx" ON "SeedMinuteLedger"("seedSessionId");

-- CreateIndex
CREATE INDEX "SeedMinuteLedger_minuteBucket_idx" ON "SeedMinuteLedger"("minuteBucket");

-- CreateIndex
CREATE UNIQUE INDEX "SeedMinuteLedger_userId_seedSessionId_serverId_minuteBucket_key" ON "SeedMinuteLedger"("userId", "seedSessionId", "serverId", "minuteBucket");

-- AddForeignKey
ALTER TABLE "AgentDevice" ADD CONSTRAINT "AgentDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedSession" ADD CONSTRAINT "SeedSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedSession" ADD CONSTRAINT "SeedSession_agentDeviceId_fkey" FOREIGN KEY ("agentDeviceId") REFERENCES "AgentDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedSession" ADD CONSTRAINT "SeedSession_currentServerId_fkey" FOREIGN KEY ("currentServerId") REFERENCES "SquadServerSeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedSessionTarget" ADD CONSTRAINT "SeedSessionTarget_seedSessionId_fkey" FOREIGN KEY ("seedSessionId") REFERENCES "SeedSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedSessionTarget" ADD CONSTRAINT "SeedSessionTarget_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "SquadServerSeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMetricSeed" ADD CONSTRAINT "ServerMetricSeed_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "SquadServerSeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSeedCommand" ADD CONSTRAINT "AgentSeedCommand_agentDeviceId_fkey" FOREIGN KEY ("agentDeviceId") REFERENCES "AgentDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSeedCommand" ADD CONSTRAINT "AgentSeedCommand_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SeedSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedRatingProfile" ADD CONSTRAINT "SeedRatingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedRatingEvent" ADD CONSTRAINT "SeedRatingEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedRatingEvent" ADD CONSTRAINT "SeedRatingEvent_seedSessionId_fkey" FOREIGN KEY ("seedSessionId") REFERENCES "SeedSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedRatingEvent" ADD CONSTRAINT "SeedRatingEvent_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "SquadServerSeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedMinuteLedger" ADD CONSTRAINT "SeedMinuteLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedMinuteLedger" ADD CONSTRAINT "SeedMinuteLedger_seedSessionId_fkey" FOREIGN KEY ("seedSessionId") REFERENCES "SeedSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedMinuteLedger" ADD CONSTRAINT "SeedMinuteLedger_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "SquadServerSeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
