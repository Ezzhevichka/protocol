-- AlterEnum
ALTER TYPE "BanTargetType" ADD VALUE 'EOS_ID';

-- CreateTable
CREATE TABLE "PrivilegeGroup" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivilegeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPrivilege" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "eosId" TEXT,
    "nickname" TEXT,
    "prefix" TEXT,
    "prefixColor" TEXT,
    "imageUrl" TEXT,
    "comment" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerPrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivilegeGroup_code_key" ON "PrivilegeGroup"("code");

-- CreateIndex
CREATE INDEX "PlayerPrivilege_steamId_idx" ON "PlayerPrivilege"("steamId");

-- CreateIndex
CREATE INDEX "PlayerPrivilege_eosId_idx" ON "PlayerPrivilege"("eosId");

-- CreateIndex
CREATE INDEX "PlayerPrivilege_groupId_idx" ON "PlayerPrivilege"("groupId");

-- CreateIndex
CREATE INDEX "PlayerPrivilege_active_idx" ON "PlayerPrivilege"("active");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPrivilege_steamId_groupId_key" ON "PlayerPrivilege"("steamId", "groupId");

-- AddForeignKey
ALTER TABLE "PlayerPrivilege" ADD CONSTRAINT "PlayerPrivilege_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PrivilegeGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
