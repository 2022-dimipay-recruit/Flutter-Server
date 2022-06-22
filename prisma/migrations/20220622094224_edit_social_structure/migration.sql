/*
  Warnings:

  - You are about to drop the column `googleLinkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `kakaoLinkId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gooogleUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kakaoUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `googleLinkId`,
    DROP COLUMN `kakaoLinkId`;

-- CreateIndex
CREATE UNIQUE INDEX `User_gooogleUid_key` ON `User`(`gooogleUid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_kakaoUid_key` ON `User`(`kakaoUid`);
