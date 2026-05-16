/*
  Warnings:

  - You are about to drop the column `code` on the `PrivilegeGroup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PrivilegeGroup` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `PrivilegeGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `PrivilegeGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `PrivilegeGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `PrivilegeGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayerPrivilege" DROP CONSTRAINT "PlayerPrivilege_groupId_fkey";

-- DropIndex
DROP INDEX "PlayerPrivilege_active_idx";

-- DropIndex
DROP INDEX "PlayerPrivilege_steamId_groupId_key";

-- DropIndex
DROP INDEX "PrivilegeGroup_code_key";

-- AlterTable
ALTER TABLE "PlayerPrivilege" ALTER COLUMN "steamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PrivilegeGroup" DROP COLUMN "code",
DROP COLUMN "name",
DROP COLUMN "sortOrder",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PlayerPrivilege_nickname_idx" ON "PlayerPrivilege"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "PrivilegeGroup_key_key" ON "PrivilegeGroup"("key");

-- AddForeignKey
ALTER TABLE "PlayerPrivilege" ADD CONSTRAINT "PlayerPrivilege_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PrivilegeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
