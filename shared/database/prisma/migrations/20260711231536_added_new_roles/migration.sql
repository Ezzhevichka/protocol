/*
  Warnings:

  - The values [ban] on the enum `SitePermissions` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `Roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `Roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'TECH_ADMIN', 'SENIOR_MODERATOR', 'MODERATOR', 'INTERN', 'CAMERA', 'VIP');

-- AlterEnum
BEGIN;
CREATE TYPE "SitePermissions_new" AS ENUM ('punish', 'perm', 'kick');
ALTER TABLE "Roles" ALTER COLUMN "site_permissions" TYPE "SitePermissions_new"[] USING ("site_permissions"::text::"SitePermissions_new"[]);
ALTER TYPE "SitePermissions" RENAME TO "SitePermissions_old";
ALTER TYPE "SitePermissions_new" RENAME TO "SitePermissions";
DROP TYPE "public"."SitePermissions_old";
COMMIT;

-- DropIndex
DROP INDEX "Roles_name_key";

-- AlterTable
ALTER TABLE "Roles" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "type" "RoleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Roles_label_key" ON "Roles"("label");
