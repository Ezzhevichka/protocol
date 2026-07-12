/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rules" ADD COLUMN     "duration" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rules_name_key" ON "Rules"("name");
